import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import {
  bFromPoles,
  collectPoles,
  fieldMagnitude,
  type Pole,
} from "./physics";
import { useBodyRegistry } from "./registry";
import { useSim } from "./store";

const LINE_COUNT = 12;
const STEPS = 18;
const DS = 0.011;
const SEED_RING = 4;

const _p = new THREE.Vector3();
const _b = { x: 0, y: 0, z: 0 };
const _pos = { x: 0, y: 0, z: 0 };

export function FieldVis() {
  const showField = useSim((s) => s.showField);
  const showFilings = useSim((s) => s.showFilings);
  return (
    <>
      {showField ? <FieldLines /> : null}
      {showFilings ? <FieldFilings /> : null}
    </>
  );
}

function FieldLines() {
  const registry = useBodyRegistry();
  const posArr = useMemo(() => new Float32Array(LINE_COUNT * STEPS * 6), []);
  const colArr = useMemo(() => new Float32Array(LINE_COUNT * STEPS * 6), []);
  const geom = useRef<THREE.BufferGeometry>(null);
  const poles = useRef<Pole[]>([]);
  const tick = useRef(0);

  useFrame(() => {
    const g = geom.current;
    if (!g) return;
    tick.current += 1;
    const bodies = useSim.getState().bodies;
    const magnets = bodies.reduce(
      (n, b) => n + (b.kind === "magnet" || b.kind === "electromagnet" ? 1 : 0),
      0,
    );
    const skip = magnets > 3 ? 4 : 3;
    if (tick.current % skip !== 0) return;

    poles.current.length = 0;
    for (const spec of bodies) {
      const rb = registry.get(spec.id);
      if (!rb) continue;
      const t = rb.translation();
      const r = rb.rotation();
      _pos.x = t.x;
      _pos.y = t.y;
      _pos.z = t.z;
      collectPoles(spec, _pos, r, poles.current);
    }

    const seeds = gatherSeeds(poles.current);
    let cursor = 0;
    const maxSeg = LINE_COUNT * STEPS;

    for (const seed of seeds) {
      if (cursor >= maxSeg) break;
      _p.set(seed.x, seed.y, seed.z);
      for (let s = 0; s < STEPS; s++) {
        if (cursor >= maxSeg) break;
        _pos.x = _p.x;
        _pos.y = _p.y;
        _pos.z = _p.z;
        bFromPoles(_pos, poles.current, undefined, _b);
        const mag = fieldMagnitude(_b);
        const len = Math.hypot(_b.x, _b.y, _b.z);
        const ax = _p.x;
        const ay = _p.y;
        const az = _p.z;
        if (len < 1e-6 || mag < 2e-5) {
          _p.x += seed.sx * DS;
          _p.y += seed.sy * DS;
          _p.z += seed.sz * DS;
        } else {
          const inv = (DS * seed.dir) / len;
          _p.x += _b.x * inv;
          _p.y += _b.y * inv;
          _p.z += _b.z * inv;
        }
        const i = cursor * 6;
        posArr[i] = ax;
        posArr[i + 1] = ay;
        posArr[i + 2] = az;
        posArr[i + 3] = _p.x;
        posArr[i + 4] = _p.y;
        posArr[i + 5] = _p.z;
        const t = colorT(mag);
        const cr = 0.49 + t * 0.4;
        const cg = 0.61 + t * 0.2;
        const cb = 0.56 + t * 0.22;
        colArr[i] = cr;
        colArr[i + 1] = cg;
        colArr[i + 2] = cb;
        colArr[i + 3] = cr;
        colArr[i + 4] = cg;
        colArr[i + 5] = cb;
        cursor++;
        if (_p.y < -0.02 || _p.y > 0.7 || Math.hypot(_p.x, _p.z) > 0.9) break;
      }
    }

    while (cursor < maxSeg) {
      const i = cursor * 6;
      posArr[i] = posArr[i + 3] = 0;
      posArr[i + 1] = posArr[i + 4] = -10;
      posArr[i + 2] = posArr[i + 5] = 0;
      cursor++;
    }

    const pa = g.getAttribute("position");
    const ca = g.getAttribute("color");
    if (pa) pa.needsUpdate = true;
    if (ca) ca.needsUpdate = true;
  });

  return (
    <lineSegments frustumCulled={false}>
      <bufferGeometry ref={geom}>
        <float32BufferAttribute attach="attributes-position" args={[posArr, 3]} />
        <float32BufferAttribute attach="attributes-color" args={[colArr, 3]} />
      </bufferGeometry>
      <lineBasicMaterial vertexColors transparent opacity={0.72} depthWrite={false} />
    </lineSegments>
  );
}

function gatherSeeds(poles: Pole[]) {
  const seeds: Array<{
    x: number;
    y: number;
    z: number;
    dir: number;
    sx: number;
    sy: number;
    sz: number;
  }> = [];
  const byBody = new Map<string, Pole[]>();
  for (const p of poles) {
    const list = byBody.get(p.bodyId) ?? [];
    list.push(p);
    byBody.set(p.bodyId, list);
  }
  for (const group of byBody.values()) {
    const north = group.find((p) => p.q > 0) ?? group[0];
    const south = group.find((p) => p.q < 0) ?? group[group.length - 1];
    if (!north || !south) continue;
    const dx = north.x - south.x;
    const dy = north.y - south.y;
    const dz = north.z - south.z;
    const L = Math.hypot(dx, dy, dz) || 1;
    const ux = dx / L;
    const uy = dy / L;
    const uz = dz / L;
    const px = Math.abs(uy) < 0.9 ? 0 : 1;
    const py = Math.abs(uy) < 0.9 ? 1 : 0;
    const pz = 0;
    const sx = uy * pz - uz * py;
    const sy = uz * px - ux * pz;
    const sz = ux * py - uy * px;
    const sl = Math.hypot(sx, sy, sz) || 1;
    for (let i = 0; i < SEED_RING; i++) {
      const a = (i / SEED_RING) * Math.PI * 2;
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      const rx = (sx / sl) * ca + (uy * sz - uz * sy) * sa;
      const ry = (sy / sl) * ca + (uz * sx - ux * sz) * sa;
      const rz = (sz / sl) * ca + (ux * sy - uy * sx) * sa;
      const rad = 0.006;
      seeds.push({
        x: north.x + rx * rad + ux * 0.002,
        y: north.y + ry * rad + uy * 0.002,
        z: north.z + rz * rad + uz * 0.002,
        dir: 1,
        sx: ux,
        sy: uy,
        sz: uz,
      });
    }
  }
  return seeds.slice(0, LINE_COUNT);
}

function colorT(mag: number) {
  const log = Math.log10(Math.max(mag, 1e-6));
  return Math.min(1, Math.max(0, (log + 4) / 4));
}

const FILINGS = 6;

function FieldFilings() {
  const registry = useBodyRegistry();
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const poles = useRef<Pole[]>([]);
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const tick = useRef(0);

  useFrame(() => {
    const inst = mesh.current;
    if (!inst) return;
    tick.current += 1;
    if (tick.current % 2 !== 0) return;
    const bodies = useSim.getState().bodies;
    poles.current.length = 0;
    for (const spec of bodies) {
      const rb = registry.get(spec.id);
      if (!rb) continue;
      const t = rb.translation();
      const r = rb.rotation();
      collectPoles(spec, { x: t.x, y: t.y, z: t.z }, r, poles.current);
    }

    let i = 0;
    for (let ix = 0; ix < FILINGS; ix++) {
      for (let iz = 0; iz < FILINGS; iz++) {
        const x = -0.42 + (ix / (FILINGS - 1)) * 0.84;
        const z = -0.3 + (iz / (FILINGS - 1)) * 0.6;
        const y = 0.018;
        bFromPoles({ x, y, z }, poles.current, undefined, _b);
        dummy.position.set(x, y, z);
        dir.set(_b.x, _b.y, _b.z);
        if (dir.lengthSq() < 1e-10) {
          dummy.scale.setScalar(0);
        } else {
          dir.normalize();
          dummy.quaternion.setFromUnitVectors(up, dir);
          const s = 0.35 + Math.min(1.4, fieldMagnitude(_b) * 40);
          dummy.scale.set(s, s, s);
        }
        dummy.updateMatrix();
        inst.setMatrixAt(i, dummy.matrix);
        i++;
      }
    }
    inst.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, FILINGS * FILINGS]}>
      <coneGeometry args={[0.003, 0.012, 5]} />
      <meshBasicMaterial color="#7d9b8e" transparent opacity={0.7} />
    </instancedMesh>
  );
}
