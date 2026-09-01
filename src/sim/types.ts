export type BodyKind =
  | "magnet"
  | "electromagnet"
  | "conductor"
  | "ferromagnetic"
  | "mercury"
  | "tube"
  | "pool";

export type BodyShape =
  | "box"
  | "cylinder"
  | "sphere"
  | "horseshoe"
  | "tube"
  | "pool"
  | "coil";

export type MomentAxis = "x" | "y" | "z";

export type CatalogId =
  | "n52-bar"
  | "n52-disc"
  | "n42-cube"
  | "ferrite-block"
  | "ferrite-horseshoe"
  | "alnico-rod"
  | "smco-cube"
  | "electromagnet"
  | "copper-plate"
  | "copper-tube"
  | "aluminum-disc"
  | "iron-block"
  | "steel-ball"
  | "mercury-drop"
  | "mercury-pool";

export interface SimBody {
  id: string;
  kind: BodyKind;
  catalogId: CatalogId;
  label: string;
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number, number];
  shape: BodyShape;
  mass: number;
  density: number;
  Br: number;
  polarity: 1 | -1;
  momentAxis: MomentAxis;
  voltage: number;
  resistance: number;
  turns: number;
  coreMuR: number;
  powered: boolean;
  conductivity: number;
  chi: number;
  anchored: boolean;
  color: string;
}

export interface CatalogItem {
  id: CatalogId;
  label: string;
  short: string;
  kind: BodyKind;
  shape: BodyShape;
  size: [number, number, number];
  density: number;
  Br: number;
  momentAxis: MomentAxis;
  voltage: number;
  resistance: number;
  turns: number;
  coreMuR: number;
  conductivity: number;
  chi: number;
  color: string;
  notes: string;
  source: string;
}

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Pole {
  x: number;
  y: number;
  z: number;
  q: number;
  bodyId: string;
}

export type PresetId = "bench" | "lenz" | "mercury" | "crane" | "zerog";
