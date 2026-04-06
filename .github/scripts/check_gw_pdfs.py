#!/usr/bin/env python3
"""
Scrapes the Warhammer Community downloads page for new 40K PDFs (FAQs, errata,
core rules). Downloads any new files to docs/rules/ and updates the manifest.

Exit codes:
  0 — ran successfully (new PDFs may or may not have been found)
  1 — unrecoverable error (caller should open a "check manually" issue)
"""

import hashlib
import json
import os
import re
import sys
from datetime import date
from pathlib import Path
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

GW_DOWNLOADS_URL = (
    "https://www.warhammer-community.com/en-gb/downloads/warhammer-40000/"
)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (compatible; GithubActions/1.0; "
        "+https://github.com/billyjohnharney/Warhammer-40K-Turn-tracker-)"
    ),
    "Accept-Language": "en-GB,en;q=0.9",
}

DOCS_DIR = Path(__file__).resolve().parents[2] / "docs" / "rules"
MANIFEST_PATH = DOCS_DIR / "manifest.json"

# Keywords that indicate a relevant PDF (case-insensitive)
RELEVANT_KEYWORDS = [
    "core rules",
    "errata",
    "faq",
    "rules update",
    "balance dataslate",
    "munitorum field manual",
    "points",
    "warhammer 40",
    "40,000",
    "40k",
]

MAX_PDF_SIZE_MB = 50  # Skip anything unreasonably large


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def load_manifest() -> dict:
    if MANIFEST_PATH.exists():
        with open(MANIFEST_PATH) as f:
            return json.load(f)
    return {"last_checked": None, "known_pdfs": []}


def save_manifest(manifest: dict) -> None:
    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(MANIFEST_PATH, "w") as f:
        json.dump(manifest, f, indent=2)
        f.write("\n")


def known_urls(manifest: dict) -> set:
    return {entry["url"] for entry in manifest.get("known_pdfs", [])}


def is_relevant(text: str) -> bool:
    lower = text.lower()
    return any(kw in lower for kw in RELEVANT_KEYWORDS)


def safe_filename(url: str, title: str) -> str:
    """Derive a clean filename from the link title or URL."""
    name = re.sub(r"[^\w\s\-]", "", title or "").strip()
    name = re.sub(r"\s+", "_", name)
    if not name:
        name = Path(urlparse(url).path).stem or "document"
    return name[:100] + ".pdf"


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def download_pdf(url: str, dest: Path) -> bool:
    """Download a PDF to dest. Returns True on success."""
    try:
        r = requests.get(url, headers=HEADERS, timeout=60, stream=True)
        r.raise_for_status()
        size = int(r.headers.get("content-length", 0))
        if size > MAX_PDF_SIZE_MB * 1024 * 1024:
            print(f"  SKIP (too large: {size // 1024 // 1024} MB): {url}")
            return False
        dest.parent.mkdir(parents=True, exist_ok=True)
        with open(dest, "wb") as f:
            for chunk in r.iter_content(65536):
                f.write(chunk)
        return True
    except Exception as exc:
        print(f"  ERROR downloading {url}: {exc}")
        if dest.exists():
            dest.unlink()
        return False


# ---------------------------------------------------------------------------
# Scraping
# ---------------------------------------------------------------------------


def fetch_pdf_links(url: str) -> list[dict]:
    """Return list of {url, title} dicts for relevant PDFs on the page."""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=30)
        resp.raise_for_status()
    except Exception as exc:
        print(f"ERROR fetching {url}: {exc}", file=sys.stderr)
        raise

    soup = BeautifulSoup(resp.text, "html.parser")
    found = []

    for a in soup.find_all("a", href=True):
        href = a["href"].strip()
        # Resolve relative URLs
        full_url = urljoin(url, href)
        # Only want PDF links
        if not full_url.lower().endswith(".pdf"):
            continue
        title = a.get_text(separator=" ", strip=True)
        # Check surrounding context too (parent element text)
        parent_text = a.parent.get_text(separator=" ", strip=True) if a.parent else ""
        combined = title + " " + parent_text
        if is_relevant(combined):
            found.append({"url": full_url, "title": title})

    return found


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main() -> int:
    print(f"Checking GW downloads page: {GW_DOWNLOADS_URL}")
    manifest = load_manifest()
    already_known = known_urls(manifest)
    today = date.today().isoformat()

    try:
        links = fetch_pdf_links(GW_DOWNLOADS_URL)
    except Exception:
        # Signal to the caller that scraping failed
        manifest["last_checked"] = today
        save_manifest(manifest)
        return 1

    print(f"Found {len(links)} relevant PDF link(s) on page.")

    new_entries = []
    for link in links:
        url = link["url"]
        title = link["title"]

        if url in already_known:
            print(f"  KNOWN: {title}")
            continue

        print(f"  NEW: {title}")
        filename = safe_filename(url, title)
        dest = DOCS_DIR / filename

        # Avoid clobbering if filename already exists (different URL)
        if dest.exists():
            stem = dest.stem
            dest = DOCS_DIR / f"{stem}_{hashlib.md5(url.encode()).hexdigest()[:6]}.pdf"

        print(f"    Downloading → {dest.name}")
        if download_pdf(url, dest):
            entry = {
                "name": dest.name,
                "title": title,
                "url": url,
                "downloaded": today,
                "sha256": sha256_file(dest),
            }
            manifest.setdefault("known_pdfs", []).append(entry)
            new_entries.append(entry)
            print(f"    OK ({dest.stat().st_size // 1024} KB)")
        else:
            # Record URL as known even on download failure so we don't
            # retry every week and spam issues.
            manifest.setdefault("known_pdfs", []).append(
                {"name": None, "title": title, "url": url, "downloaded": today, "sha256": None}
            )

    manifest["last_checked"] = today
    save_manifest(manifest)

    # Write a summary file that the GitHub Action workflow reads
    summary_path = Path("/tmp/gw_update_summary.json")
    with open(summary_path, "w") as f:
        json.dump(
            {
                "new_count": len(new_entries),
                "new_pdfs": new_entries,
                "checked_url": GW_DOWNLOADS_URL,
                "date": today,
            },
            f,
            indent=2,
        )

    print(f"\nDone. {len(new_entries)} new PDF(s) downloaded.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
