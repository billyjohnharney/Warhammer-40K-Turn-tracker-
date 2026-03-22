/**
 * Version metadata for each data file in src/data/.
 *
 * Update this file whenever you apply a GW rules change:
 *   - bump `appVersion`
 *   - update the relevant entry's `lastUpdated` and `sourceDoc`
 *   - add a short note to `changelog`
 */

export const DATA_VERSION = {
  /** Increment this each time any data file changes. */
  appVersion: "1.0.0",

  /** ISO date this metadata was last touched. */
  metaUpdated: "2026-03-22",

  sources: {
    phases: {
      file: "src/data/phases.js",
      sourceDoc: "Warhammer 40,000 Core Rules — 10th Edition",
      lastUpdated: "2026-03-22",
      changelog: [
        { date: "2026-03-22", note: "Initial data entry from 10th Ed core rules PDF." },
      ],
    },
    keywords: {
      file: "src/data/keywords.js",
      sourceDoc: "Warhammer 40,000 Core Rules — 10th Edition",
      lastUpdated: "2026-03-22",
      changelog: [
        { date: "2026-03-22", note: "Initial data entry from 10th Ed core rules PDF." },
      ],
    },
    commandPhaseAbilities: {
      file: "src/data/commandPhaseAbilities.js",
      sourceDoc: "Warhammer 40,000 Core Rules — 10th Edition",
      lastUpdated: "2026-03-22",
      changelog: [
        { date: "2026-03-22", note: "Initial data entry from 10th Ed core rules PDF." },
      ],
    },
    pregameSteps: {
      file: "src/data/pregameSteps.js",
      sourceDoc: "Warhammer 40,000 Core Rules — 10th Edition",
      lastUpdated: "2026-03-22",
      changelog: [
        { date: "2026-03-22", note: "Initial data entry from 10th Ed core rules PDF." },
      ],
    },
  },
};
