import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useMemo } from "react";
import { Overlay } from "./Overlay";
import { RegistryContext, type BodyRegistry } from "./registry";
import { useSim } from "./store";
import { World } from "./World";

/** Full client lab — canvas + overlay. Used when dynamically imported as a whole. */
export function Playground() {
  return (
    <div className="relative h-dvh w-full overflow-hidden bg-bg text-fg">
      <Scene />
      <Overlay />
    </div>
  );
}

/** Canvas only — overlay can mount from the route for first paint. */
export function Scene() {
  const registry = useMemo<BodyRegistry>(() => new Map(), []);
  const select = useSim((s) => s.select);
  const loadPreset = useSim((s) => s.loadPreset);
  const togglePaused = useSim((s) => s.togglePaused);
  const remove = useSim((s) => s.remove);
  const spawn = useSim((s) => s.spawn);
  const setShowField = useSim((s) => s.setShowField);
  const setIntro = useSim((s) => s.setIntro);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 720;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) {
        return;
      }
      if (e.code === "Space") {
        e.preventDefault();
        togglePaused();
      } else if (e.code === "KeyF") {
        setShowField(!useSim.getState().showField);
      } else if (e.code === "Escape") {
        if (useSim.getState().intro) setIntro(false);
        else select(null);
      } else if (e.code === "Delete" || e.code === "Backspace") {
        const id = useSim.getState().selectedId;
        if (id) remove(id);
      } else if (e.code === "KeyR" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        loadPreset("bench");
      } else if (e.code === "Digit1") spawn("n52-bar");
      else if (e.code === "Digit2") spawn("n52-disc");
      else if (e.code === "Digit3") spawn("electromagnet");
      else if (e.code === "Digit4") spawn("copper-plate");
      else if (e.code === "Digit5") spawn("copper-tube");
      else if (e.code === "Digit6") spawn("iron-block");
      else if (e.code === "Digit7") spawn("mercury-drop");
      else if (e.code === "Digit8") spawn("mercury-pool");
      else if (e.code === "Digit9") spawn("steel-ball");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [loadPreset, remove, select, setIntro, setShowField, spawn, togglePaused]);

  return (
    <RegistryContext.Provider value={registry}>
      <Suspense fallback={null}>
        <Canvas
          shadows={false}
          dpr={isMobile ? [1, 1] : [1, 1.15]}
          camera={{ position: [0.52, 0.38, 0.58], fov: 40, near: 0.02, far: 20 }}
          gl={{
            antialias: !isMobile,
            alpha: false,
            powerPreference: "default",
            failIfMajorPerformanceCaveat: false,
            stencil: false,
            depth: true,
          }}
          style={{ touchAction: "none", position: "absolute", inset: 0, zIndex: 0 }}
          onCreated={({ gl }) => {
            const el = gl.domElement;
            const onLost = (e: Event) => e.preventDefault();
            el.addEventListener("webglcontextlost", onLost, false);
          }}
          onPointerMissed={() => {
            if (!useSim.getState().draggingId) select(null);
          }}
        >
          <World />
        </Canvas>
      </Suspense>
    </RegistryContext.Provider>
  );
}
