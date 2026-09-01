import { createBody } from "./catalog";
import type { PresetId, SimBody } from "./types";

export function buildPreset(id: PresetId): SimBody[] {
  switch (id) {
    case "lenz":
      return [
        createBody("copper-tube", [0, 0.12, 0], { anchored: true }),
        createBody("n52-disc", [0, 0.34, 0], { polarity: 1 }),
      ];
    case "mercury":
      return [
        createBody("mercury-pool", [0, 0.03, 0], { anchored: true }),
        createBody("n52-bar", [0.22, 0.07, 0], { polarity: 1 }),
        createBody("mercury-drop", [-0.18, 0.08, 0]),
      ];
    case "crane":
      return [
        createBody("electromagnet", [0, 0.18, 0], {
          anchored: true,
          voltage: 12,
          powered: true,
        }),
        createBody("iron-block", [0, 0.04, 0.12]),
        createBody("steel-ball", [0.1, 0.05, -0.08]),
      ];
    case "zerog":
      return [
        createBody("n52-bar", [-0.18, 0.16, 0], { polarity: 1 }),
        createBody("n52-bar", [0.18, 0.16, 0], { polarity: 1 }),
        createBody("steel-ball", [0, 0.2, 0.16]),
      ];
    case "bench":
    default:
      // Quiet start: one magnet, one conductor. No slam, no crane, no pool.
      return [
        createBody("n52-bar", [-0.18, 0.06, 0], { polarity: 1 }),
        createBody("copper-plate", [0.14, 0.025, 0]),
      ];
  }
}

export const PRESET_META: { id: PresetId; label: string; blurb: string }[] = [
  { id: "bench", label: "Quiet bench", blurb: "One magnet, one plate — spawn more" },
  { id: "lenz", label: "Lenz drop", blurb: "Magnet through a copper tube" },
  { id: "mercury", label: "Mercury bath", blurb: "NdFeB floats on Hg" },
  { id: "crane", label: "EM crane", blurb: "Voltage lifts iron scrap" },
  { id: "zerog", label: "Zero-g", blurb: "Dipoles with gravity off" },
];
