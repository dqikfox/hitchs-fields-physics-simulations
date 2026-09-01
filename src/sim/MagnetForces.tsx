import { useBeforePhysicsStep } from "@react-three/rapier";
import { useRef } from "react";
import { bFromPoles, solveForces, vlen, type BodySnapshot } from "./physics";
import { useBodyRegistry } from "./registry";
import { simStats } from "./stats";
import { useSim } from "./store";

export function MagnetForces() {
  const registry = useBodyRegistry();
  const snaps = useRef<BodySnapshot[]>([]);

  useBeforePhysicsStep(() => {
    try {
      stepForces(registry, snaps.current);
    } catch {
      /* keep the world stepping even if a force eval blows up */
    }
  });

  return null;
}

function stepForces(registry: Map<string, import("@react-three/rapier").RapierRigidBody>, list: BodySnapshot[]) {
  const { bodies, gravity, paused, selectedId } = useSim.getState();
  if (paused) return;
  if (typeof document !== "undefined" && document.hidden) return;

  list.length = 0;

  for (const spec of bodies) {
    const rb = registry.get(spec.id);
    if (!rb) continue;
    const t = rb.translation();
    if (!Number.isFinite(t.x) || !Number.isFinite(t.y) || !Number.isFinite(t.z) || escaped(t)) {
      rb.setTranslation({ x: spec.position[0], y: spec.position[1], z: spec.position[2] }, true);
      rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rb.setAngvel({ x: 0, y: 0, z: 0 }, true);
      continue;
    }
    const r = rb.rotation();
    const v = rb.linvel();
    const w = rb.angvel();
    list.push({
      spec,
      pos: { x: t.x, y: t.y, z: t.z },
      quat: { x: r.x, y: r.y, z: r.z, w: r.w },
      vel: { x: v.x, y: v.y, z: v.z },
      ang: { x: w.x, y: w.y, z: w.z },
    });
  }

  const { forces, poles, maxB } = solveForces(list, gravity);
  let maxF = 0;
  let selectedB = 0;

  for (const f of forces) {
    const rb = registry.get(f.id);
    if (!rb) continue;
    rb.resetForces(true);
    rb.resetTorques(true);
    if (!Number.isFinite(f.force.x) || !Number.isFinite(f.torque.x)) continue;
    const mag = vlen(f.force);
    maxF = Math.max(maxF, mag);
    if (!rb.isDynamic()) continue;
    rb.addForce(f.force, true);
    rb.addTorque(f.torque, true);
    if (mag > 0.15) rb.wakeUp();
  }

  if (selectedId) {
    const snap = list.find((s) => s.spec.id === selectedId);
    if (snap) {
      const B = bFromPoles(snap.pos, poles, snap.spec.id);
      selectedB = vlen(B);
    }
  }

  simStats.maxB = maxB;
  simStats.maxF = maxF;
  simStats.selectedB = selectedB;
}

function escaped(t: { x: number; y: number; z: number }) {
  return Math.abs(t.x) > 1.35 || t.y > 1.5 || t.y < -0.35 || Math.abs(t.z) > 1.05;
}
