import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ComponentType } from "react";
import { LabErrorBoundary } from "@/sim/LabErrorBoundary";
import { Overlay } from "@/sim/Overlay";
import { useSim } from "@/sim/store";

export const Route = createFileRoute("/")({ component: Home });

const playgroundLoad =
  typeof document !== "undefined" ? import("@/sim/Playground") : null;

function Home() {
  const [Scene, setScene] = useState<ComponentType | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [sceneKey, setSceneKey] = useState(0);

  useEffect(() => {
    useSim.getState().hydrate();
    let cancelled = false;
    const load = playgroundLoad ?? import("@/sim/Playground");
    void load
      .then((mod) => {
        if (!cancelled) setScene(() => mod.Scene);
      })
      .catch((e: unknown) => {
        if (!cancelled) setErr(e instanceof Error ? e.message : String(e));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const resetLab = () => {
    useSim.getState().resetLab();
    setErr(null);
    setSceneKey((k) => k + 1);
  };

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-bg text-fg">
      {err ? (
        <div className="absolute inset-0 z-20 grid place-items-center px-6">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-medium">Lab failed to load</h1>
            <p className="mt-3 text-sm text-muted">{err}</p>
            <button
              type="button"
              className="mt-5 h-10 rounded-md bg-fg px-4 text-sm text-bg"
              onClick={resetLab}
            >
              Try again
            </button>
          </div>
        </div>
      ) : Scene ? (
        <LabErrorBoundary key={sceneKey} onReset={resetLab}>
          <Scene />
        </LabErrorBoundary>
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <p className="font-mono text-[10px] tracking-[0.28em] text-muted uppercase">
              HFPS
            </p>
            <p className="mt-2 text-sm text-muted">Warming the bench…</p>
          </div>
        </div>
      )}
      <Overlay />
    </div>
  );
}
