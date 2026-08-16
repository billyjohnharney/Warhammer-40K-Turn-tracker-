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
  appVersion: "1.1.0",

  /** ISO date this metadata was last touched. */
  metaUpdated: "2026-06-16",

  sources: {
    phases: {
      file: "src/data/phases.js",
      sourceDoc: "Warhammer 40,000 Core Rules — 11th Edition",
      lastUpdated: "2026-06-16",
      changelog: [
        { date: "2026-03-22", note: "Initial data entry from 10th Ed core rules PDF." },
        { date: "2026-06-16", note: "Updated to 11th Ed: persistent/retested Battle-shock, four named shooting types (Normal/Assault/Close-Quarters/Indirect), Benefit of Cover now worsens BS by 1 instead of a Save bonus, revised Heavy conditions, Hazardous now uses Hazard rolls, two-mode Heroic Intervention, Overrun Fight and three Consolidation modes (Ongoing/Engaging/Objective)." },
      ],
    },
    keywords: {
      file: "src/data/keywords.js",
      sourceDoc: "Warhammer 40,000 Core Rules — 11th Edition",
      lastUpdated: "2026-06-16",
      changelog: [
        { date: "2026-03-22", note: "Initial data entry from 10th Ed core rules PDF." },
        { date: "2026-06-16", note: "Updated to 11th Ed: added [CLEAVE X]; [PISTOL] superseded by [CLOSE-QUARTERS]; reworked Stealth/Ignores Cover/Smoke around the new -1 BS Benefit of Cover; rewrote Hazardous, Heavy, Hover, Deep Strike, Infiltrators, Leader, Scouts, Objective Secured to match 11th Ed wording; renamed GRENADE→EXPLOSIVES and TANK SHOCK→CRUSHING IMPACT (mechanic changed); removed GO TO GROUND and NEW ORDERS, no longer core stratagems." },
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
      sourceDoc: "Warhammer 40,000 Core Rules — 11th Edition",
      lastUpdated: "2026-06-16",
      changelog: [
        { date: "2026-03-22", note: "Initial data entry from 10th Ed core rules PDF." },
        { date: "2026-06-16", note: "Updated to 11th Ed: split Leader/Support attachment into its own Muster Armies step (separate from Declare Battle Formations); renamed final step to Resolve Pre-battle Abilities and updated Scouts distance to 8\"." },
      ],
    },
  },
};
