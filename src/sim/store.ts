import { create } from "zustand";
import { CATALOG, createBody } from "./catalog";
import { buildPreset } from "./presets";
import type { CatalogId, PresetId, SimBody } from "./types";

const SAVE_KEY = "hfps-lab-v2";
export const MAX_BODIES = 8;

const SPAWN_SLOTS: [number, number, number][] = [
  [-0.28, 0.08, 0.18],
  [0.28, 0.08, 0.18],
  [-0.28, 0.08, -0.18],
  [0.28, 0.08, -0.18],
  [0, 0.09, 0.22],
  [0, 0.09, -0.22],
  [-0.34, 0.1, 0],
  [0.34, 0.1, 0],
];

export interface SimState {
  bodies: SimBody[];
  gravity: number;
  paused: boolean;
  showField: boolean;
  showFilings: boolean;
  selectedId: string | null;
  draggingId: string | null;
  intro: boolean;
  railVoltage: number;
  probeB: number;
  lastForce: number;
  epoch: number;
  spawn: (id: CatalogId, position?: [number, number, number]) => void;
  remove: (id: string) => void;
  clear: () => void;
  loadPreset: (id: PresetId) => void;
  select: (id: string | null) => void;
  setDragging: (id: string | null) => void;
  updateBody: (id: string, patch: Partial<SimBody>) => void;
  setGravity: (g: number) => void;
  setPaused: (v: boolean) => void;
  togglePaused: () => void;
  setShowField: (v: boolean) => void;
  setShowFilings: (v: boolean) => void;
  setIntro: (v: boolean) => void;
  setRailVoltage: (v: number) => void;
  setProbe: (B: number, F: number) => void;
  persist: () => void;
  hydrate: () => void;
  resetLab: () => void;
}

function nextSpawnPos(count: number): [number, number, number] {
  const slot = SPAWN_SLOTS[count % SPAWN_SLOTS.length];
  const lap = Math.floor(count / SPAWN_SLOTS.length);
  return [slot[0], slot[1] + lap * 0.06, slot[2]];
}

let persistTimer: ReturnType<typeof setTimeout> | null = null;

function quietState() {
  return {
    bodies: buildPreset("bench"),
    gravity: 9.81,
    paused: false,
    showField: false,
    showFilings: false,
    selectedId: null as string | null,
    draggingId: null as string | null,
    intro: false,
    railVoltage: 12,
    probeB: 0,
    lastForce: 0,
    epoch: 0,
  };
}

function createSim() {
  return create<SimState>((set, get) => ({
    ...quietState(),

    spawn: (id, position) => {
      if (get().bodies.length >= MAX_BODIES) return;
      const item = CATALOG[id];
      const pos = position ?? nextSpawnPos(get().bodies.length);
      const extra: Partial<SimBody> = {};
      if (item.kind === "electromagnet") extra.voltage = get().railVoltage;
      set((s) => ({
        bodies: [...s.bodies, createBody(id, pos, extra)],
        selectedId: null,
      }));
      get().persist();
    },

    remove: (id) => {
      set((s) => ({
        bodies: s.bodies.filter((b) => b.id !== id),
        selectedId: s.selectedId === id ? null : s.selectedId,
      }));
      get().persist();
    },

    clear: () => {
      set((s) => ({ bodies: [], selectedId: null, epoch: s.epoch + 1 }));
      get().persist();
    },

    loadPreset: (id) => {
      set((s) => ({
        bodies: buildPreset(id),
        selectedId: null,
        draggingId: null,
        gravity: id === "zerog" ? 0 : 9.81,
        paused: false,
        showField: false,
        showFilings: false,
        epoch: s.epoch + 1,
      }));
      get().persist();
    },

    select: (id) => set({ selectedId: id }),
    setDragging: (id) => set({ draggingId: id }),

    updateBody: (id, patch) => {
      set((s) => ({
        bodies: s.bodies.map((b) => (b.id === id ? { ...b, ...patch } : b)),
      }));
      get().persist();
    },

    setGravity: (g) => set({ gravity: g }),
    setPaused: (v) => set({ paused: v }),
    togglePaused: () => set((s) => ({ paused: !s.paused })),
    setShowField: (v) => set({ showField: v }),
    setShowFilings: (v) => set({ showFilings: v }),
    setIntro: (v) => set({ intro: v }),
    setRailVoltage: (v) => set({ railVoltage: v }),
    setProbe: (B, F) => set({ probeB: B, lastForce: F }),

    persist: () => {
      if (typeof localStorage === "undefined") return;
      if (persistTimer) clearTimeout(persistTimer);
      persistTimer = setTimeout(() => {
        try {
          localStorage.setItem(SAVE_KEY, JSON.stringify({ bodies: get().bodies }));
        } catch {
          /* ignore quota */
        }
      }, 450);
    },

    hydrate: () => {
      /* always boot from the quiet bench */
    },

    resetLab: () => {
      if (persistTimer) {
        clearTimeout(persistTimer);
        persistTimer = null;
      }
      try {
        localStorage.removeItem(SAVE_KEY);
        localStorage.removeItem("hfps-lab-v1");
      } catch {
        /* ignore */
      }
      const next = quietState();
      set({ ...next, epoch: get().epoch + 1 });
    },
  }));
}

const root = globalThis as unknown as { __hfpsStore?: ReturnType<typeof createSim> };
export const useSim = import.meta.hot
  ? (root.__hfpsStore = createSim())
  : (root.__hfpsStore ??= createSim());
