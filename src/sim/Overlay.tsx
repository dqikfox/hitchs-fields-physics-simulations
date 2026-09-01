import { Link } from "@tanstack/react-router";
import {
  Anchor,
  Eye,
  EyeOff,
  FlipHorizontal,
  Pause,
  Play,
  RotateCcw,
  Trash2,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { CATALOG, SPAWN_ORDER } from "./catalog";
import { coilCurrent, dipoleMomentMagnitude, formatTesla } from "./physics";
import { PRESET_META } from "./presets";
import { simStats } from "./stats";
import { useSim, MAX_BODIES } from "./store";
import type { CatalogId } from "./types";

export function Overlay() {
  const intro = useSim((s) => s.intro);
  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-10">
        <TopBar />
        <LeftRail />
        <RightInspector />
        <BottomDock />
      </div>
      {intro ? <Intro /> : null}
    </>
  );
}

function TopBar() {
  const paused = useSim((s) => s.paused);
  const togglePaused = useSim((s) => s.togglePaused);
  const showField = useSim((s) => s.showField);
  const setShowField = useSim((s) => s.setShowField);
  const clear = useSim((s) => s.clear);
  const { user, isPending } = useCurrentUserState();

  return (
    <header className="pointer-events-auto absolute top-0 right-0 left-0 flex items-center justify-between gap-3 px-3 pt-3 md:px-4">
      <div className="flex min-w-0 items-center gap-3 rounded-lg border border-line bg-surface/90 px-3 py-2 backdrop-blur-sm">
        <div className="min-w-0">
          <p className="font-mono text-[10px] tracking-[0.24em] text-muted uppercase">
            HFPS
          </p>
          <h1 className="truncate text-sm font-medium tracking-tight md:text-base">
            Hitchs Fields
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-1.5 rounded-lg border border-line bg-surface/90 p-1 backdrop-blur-sm">
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={togglePaused}
          aria-label={paused ? "Resume" : "Pause"}
        >
          {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
        </Button>
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={() => setShowField(!showField)}
          aria-label={showField ? "Hide field" : "Show field"}
        >
          {showField ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
        </Button>
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={() => useSim.getState().resetLab()}
          aria-label="Reset bench"
        >
          <RotateCcw className="size-4" />
        </Button>
        <Button size="icon-sm" variant="ghost" onClick={clear} aria-label="Clear world">
          <Trash2 className="size-4" />
        </Button>
        <div className="mx-1 hidden h-5 w-px bg-line sm:block" />
        <div className="hidden items-center pr-1 sm:flex">
          {isPending ? (
            <div className="size-7 animate-pulse rounded-full bg-surface-2" />
          ) : user ? (
            <SignedIn>
              <UserButton />
            </SignedIn>
          ) : (
            <SignedOut>
              <Link
                to="/login"
                className="px-2 text-xs text-muted hover:text-fg"
              >
                Sign in
              </Link>
            </SignedOut>
          )}
        </div>
      </div>
    </header>
  );
}

function LeftRail() {
  const spawn = useSim((s) => s.spawn);
  return (
    <aside className="pointer-events-auto absolute top-20 bottom-28 left-3 hidden w-44 flex-col max-md:hidden md:flex">
      <div className="flex-1 overflow-y-auto rounded-lg border border-line bg-surface/90 p-2 backdrop-blur-sm">
        <p className="px-1 pb-2 font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
          Spawn
        </p>
        <div className="flex flex-col gap-1">
          {SPAWN_ORDER.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => spawn(id)}
              className="flex items-center justify-between rounded-sm px-2 py-1.5 text-left text-xs text-fg transition-colors hover:bg-surface-2"
            >
              <span>{CATALOG[id].label}</span>
              <span className="font-mono text-[10px] text-faint">
                {CATALOG[id].short}
              </span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

function RightInspector() {
  const selectedId = useSim((s) => s.selectedId);
  const body = useSim((s) => s.bodies.find((b) => b.id === selectedId) ?? null);
  const updateBody = useSim((s) => s.updateBody);
  const remove = useSim((s) => s.remove);
  const [liveB, setLiveB] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => setLiveB(simStats.selectedB), 200);
    return () => window.clearInterval(t);
  }, []);

  if (!body) {
    return (
      <aside className="pointer-events-none absolute top-20 right-3 hidden w-64 max-md:hidden md:block">
        <div className="rounded-lg border border-line bg-surface/80 p-4 text-sm text-muted backdrop-blur-sm">
          Click a body to inspect remnant field, voltage, mass, and polarity.
          The bench starts quiet — spawn items from the left rail. Drag to
          move. Shift-drag to lift.
        </div>
      </aside>
    );
  }

  const item = CATALOG[body.catalogId];
  const I = coilCurrent(body);
  const m = dipoleMomentMagnitude(body);

  return (
    <aside className="pointer-events-auto absolute top-20 right-3 bottom-28 hidden w-72 overflow-y-auto max-md:hidden md:block">
      <div className="rounded-lg border border-line bg-surface/92 p-3 backdrop-blur-sm">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">
              {body.kind}
            </p>
            <h2 className="text-sm font-medium">{body.label}</h2>
          </div>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => remove(body.id)}
            aria-label="Delete body"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>

        <p className="mt-2 text-[11px] leading-relaxed text-muted">{item.notes}</p>
        <p className="mt-1 font-mono text-[10px] text-faint">{item.source}</p>

        <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 font-mono text-[11px]">
          <Stat k="Mass" v={`${body.mass.toFixed(3)} kg`} />
          <Stat k="ρ" v={`${body.density.toFixed(0)} kg/m³`} />
          {body.Br > 0 ? <Stat k="Br" v={`${body.Br.toFixed(2)} T`} /> : null}
          {m > 0 ? <Stat k="m" v={`${m.toFixed(3)} A·m²`} /> : null}
          {body.kind === "electromagnet" ? (
            <>
              <Stat k="I" v={`${I.toFixed(2)} A`} />
              <Stat k="N" v={`${body.turns} turns`} />
            </>
          ) : null}
          {body.conductivity > 1 ? (
            <Stat k="σ" v={body.conductivity.toExponential(2)} />
          ) : null}
          <Stat k="B ext" v={formatTesla(liveB)} />
        </dl>

        <div className="mt-4 space-y-3">
          <LabeledSlider
            label="Mass"
            unit="kg"
            value={body.mass}
            min={0.008}
            max={2}
            step={0.002}
            onChange={(v) => updateBody(body.id, { mass: v })}
          />

          {body.kind === "electromagnet" ? (
            <>
              <LabeledSlider
                label="Voltage"
                unit="V"
                value={body.voltage}
                min={0}
                max={48}
                step={0.5}
                onChange={(v) => updateBody(body.id, { voltage: v })}
              />
              <div className="flex gap-1.5">
                <Button
                  size="sm"
                  variant={body.powered ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => updateBody(body.id, { powered: !body.powered })}
                >
                  <Zap className="size-3.5" />
                  {body.powered ? "Powered" : "Off"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    updateBody(body.id, {
                      polarity: body.polarity === 1 ? -1 : 1,
                    })
                  }
                >
                  <FlipHorizontal className="size-3.5" />
                  Flip
                </Button>
              </div>
            </>
          ) : null}

          {body.kind === "magnet" ? (
            <div className="flex gap-1.5">
              <Button
                size="sm"
                variant={body.polarity === 1 ? "north" : "outline"}
                className="flex-1"
                onClick={() => updateBody(body.id, { polarity: 1 })}
              >
                N up
              </Button>
              <Button
                size="sm"
                variant={body.polarity === -1 ? "south" : "outline"}
                className="flex-1"
                onClick={() => updateBody(body.id, { polarity: -1 })}
              >
                S up
              </Button>
            </div>
          ) : null}

          {body.kind !== "pool" ? (
            <Button
              size="sm"
              variant={body.anchored ? "default" : "outline"}
              className="w-full"
              onClick={() => updateBody(body.id, { anchored: !body.anchored })}
            >
              <Anchor className="size-3.5" />
              {body.anchored ? "Anchored" : "Free body"}
            </Button>
          ) : null}
        </div>
      </div>
    </aside>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-faint">{k}</dt>
      <dd className="text-fg tabular-nums">{v}</dd>
    </div>
  );
}

function LabeledSlider({
  label,
  unit,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex justify-between text-[11px] text-muted">
        <span>{label}</span>
        <span className="font-mono tabular-nums text-fg">
          {value.toFixed(step < 0.1 ? 2 : 1)} {unit}
        </span>
      </span>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(v) => onChange(v[0] ?? value)}
      />
    </label>
  );
}

function BottomDock() {
  const gravity = useSim((s) => s.gravity);
  const setGravity = useSim((s) => s.setGravity);
  const railVoltage = useSim((s) => s.railVoltage);
  const setRailVoltage = useSim((s) => s.setRailVoltage);
  const showFilings = useSim((s) => s.showFilings);
  const setShowFilings = useSim((s) => s.setShowFilings);
  const loadPreset = useSim((s) => s.loadPreset);
  const spawn = useSim((s) => s.spawn);
  const bodyCount = useSim((s) => s.bodies.length);
  const [probe, setProbe] = useState({ B: 0, F: 0 });

  useEffect(() => {
    const t = window.setInterval(
      () => setProbe({ B: simStats.maxB, F: simStats.maxF }),
      200,
    );
    return () => window.clearInterval(t);
  }, []);

  return (
    <div className="pointer-events-auto absolute right-3 bottom-3 left-3 md:left-52 md:right-80">
      <div className="mb-2 flex gap-1 overflow-x-auto md:hidden">
        {SPAWN_ORDER.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => spawn(id)}
            className="shrink-0 rounded-sm border border-line bg-surface px-2.5 py-2 text-[11px] text-fg"
          >
            {CATALOG[id].short}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-line bg-surface/92 p-3 backdrop-blur-sm">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {PRESET_META.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => loadPreset(p.id)}
              className="rounded-sm border border-line px-2 py-1 text-[11px] text-muted transition-colors hover:border-accent hover:text-fg"
              title={p.blurb}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <LabeledSlider
            label="Gravity"
            unit="m/s²"
            value={gravity}
            min={0}
            max={20}
            step={0.01}
            onChange={setGravity}
          />
          <LabeledSlider
            label="Rail voltage"
            unit="V"
            value={railVoltage}
            min={0}
            max={48}
            step={0.5}
            onChange={setRailVoltage}
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] text-muted">
          <span className="tabular-nums">
            {bodyCount}/{MAX_BODIES} · |B|max {formatTesla(probe.B)} · |F|max {probe.F.toFixed(2)} N
          </span>
          <button
            type="button"
            onClick={() => setShowFilings(!showFilings)}
            className={cn(
              "rounded-sm border px-2 py-1 text-[10px]",
              showFilings
                ? "border-accent text-fg"
                : "border-line text-muted hover:text-fg",
            )}
          >
            Filings {showFilings ? "on" : "off"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Intro() {
  const setIntro = useSim((s) => s.setIntro);
  return (
    <div className="pointer-events-auto absolute inset-0 z-50 grid place-items-center bg-bg/72 px-5">
      <div className="w-full max-w-md rounded-xl border border-line bg-surface p-6 md:p-8">
        <p className="font-mono text-[11px] tracking-[0.28em] text-muted uppercase">
          HFPS
        </p>
        <h2 className="mt-2 text-3xl font-medium tracking-tight">Hitchs Fields</h2>
        <p className="mt-1 text-sm text-muted">Physics Simulation</p>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Tabletop electromagnetism with published magnet grades, Gilbert pole
          fields, Faraday eddy drag, and a real mercury bath — NdFeB floats.
        </p>
        <ul className="mt-4 space-y-1.5 text-sm text-fg/90">
          <li>Drag bodies · Shift-drag to lift</li>
          <li>WASD pans the bench · Q/E raise the view</li>
          <li>Space pauses · F toggles field lines</li>
        </ul>
        <Button
          variant="default"
          className="mt-6 h-11 w-full"
          onClick={() => setIntro(false)}
        >
          Enter the lab
        </Button>
      </div>
    </div>
  );
}

export function spawnLabel(_id: CatalogId) {
  return CATALOG[_id].label;
}
