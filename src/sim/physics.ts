import { characteristicSize, volumeOf } from "./catalog";
import type { Pole, SimBody, Vec3 } from "./types";
export type { Pole };

/** μ₀ = 4π×10⁻⁷ T·m/A */
export const MU0 = 1.25663706212e-6;
export const MU0_4PI = 1e-7;
export const G_EARTH = 9.80665;

const R_MIN = 0.014;
const F_POLE_CAP = 12;
const F_BODY_CAP = 16;
const TAU_CAP = 0.4;
const EDDY_GEO = 0.18;
const FERRO_SAT = 1.6;

export function vset(x = 0, y = 0, z = 0): Vec3 {
  return { x, y, z };
}

export function vadd(a: Vec3, b: Vec3, o: Vec3) {
  o.x = a.x + b.x;
  o.y = a.y + b.y;
  o.z = a.z + b.z;
  return o;
}

export function vsub(a: Vec3, b: Vec3, o: Vec3) {
  o.x = a.x - b.x;
  o.y = a.y - b.y;
  o.z = a.z - b.z;
  return o;
}

export function vscale(a: Vec3, s: number, o: Vec3) {
  o.x = a.x * s;
  o.y = a.y * s;
  o.z = a.z * s;
  return o;
}

export function vdot(a: Vec3, b: Vec3) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

export function vlen(a: Vec3) {
  return Math.hypot(a.x, a.y, a.z);
}

export function vcopy(a: Vec3, o: Vec3) {
  o.x = a.x;
  o.y = a.y;
  o.z = a.z;
  return o;
}

function clampMag(v: Vec3, max: number) {
  if (!Number.isFinite(v.x) || !Number.isFinite(v.y) || !Number.isFinite(v.z)) {
    v.x = 0;
    v.y = 0;
    v.z = 0;
    return v;
  }
  const L = vlen(v);
  if (L > max && L > 0) vscale(v, max / L, v);
  return v;
}

/** Rotate local axis by a unit quaternion (x,y,z,w). */
export function rotateAxis(
  q: { x: number; y: number; z: number; w: number },
  axis: "x" | "y" | "z",
  o: Vec3,
) {
  const lx = axis === "x" ? 1 : 0;
  const ly = axis === "y" ? 1 : 0;
  const lz = axis === "z" ? 1 : 0;
  const { x, y, z, w } = q;
  const ix = w * lx + y * lz - z * ly;
  const iy = w * ly + z * lx - x * lz;
  const iz = w * lz + x * ly - y * lx;
  const iw = -x * lx - y * ly - z * lz;
  o.x = ix * w + iw * -x + iy * -z - iz * -y;
  o.y = iy * w + iw * -y + iz * -x - ix * -z;
  o.z = iz * w + iw * -z + ix * -y - iy * -x;
  return o;
}

export function coilCurrent(body: SimBody) {
  if (body.kind !== "electromagnet" || !body.powered) return 0;
  return body.voltage / Math.max(body.resistance, 0.05);
}

/**
 * Equivalent pole strength q (A·m).
 * Permanent: q = M A = (Br / μ₀) A, with m = q L = (Br/μ₀) V.
 * Coil: m = N I A_core μr, q = m / L.
 */
export function poleStrength(body: SimBody) {
  const area = poleArea(body);
  const len = poleLength(body);
  if (body.kind === "electromagnet") {
    const I = coilCurrent(body);
    const m = body.turns * I * area * body.coreMuR;
    return (body.polarity * m) / Math.max(len, 1e-4);
  }
  if (body.kind === "magnet") {
    return (body.polarity * body.Br * area) / MU0;
  }
  return 0;
}

function poleArea(body: SimBody) {
  const [sx, sy, sz] = body.size;
  if (body.shape === "cylinder" || body.shape === "coil" || body.shape === "sphere") {
    const r = sx / 2;
    return Math.PI * r * r;
  }
  if (body.momentAxis === "y") return sx * sz;
  if (body.momentAxis === "x") return sy * sz;
  return sx * sy;
}

function poleLength(body: SimBody) {
  if (body.momentAxis === "y") return body.size[1];
  if (body.momentAxis === "x") return body.size[0];
  return body.size[2];
}

export function collectPoles(
  body: SimBody,
  pos: Vec3,
  quat: { x: number; y: number; z: number; w: number },
  out: Pole[],
) {
  if (body.kind !== "magnet" && body.kind !== "electromagnet") return;

  const axis = rotateAxis(quat, body.momentAxis, vset());
  const n = vlen(axis) || 1;
  axis.x /= n;
  axis.y /= n;
  axis.z /= n;

  if (body.shape === "horseshoe") {
    const halfW = body.size[0] * 0.32;
    const halfD = body.size[2] * 0.2;
    const q = poleStrength(body) * 0.85;
    const right = rotateAxis(quat, "x", vset());
    const rn = vlen(right) || 1;
    right.x /= rn;
    right.y /= rn;
    right.z /= rn;
    const fwd = rotateAxis(quat, "z", vset());
    const fn = vlen(fwd) || 1;
    fwd.x /= fn;
    fwd.y /= fn;
    fwd.z /= fn;
    out.push({
      x: pos.x + right.x * halfW + fwd.x * halfD,
      y: pos.y + right.y * halfW + fwd.y * halfD,
      z: pos.z + right.z * halfW + fwd.z * halfD,
      q,
      bodyId: body.id,
    });
    out.push({
      x: pos.x - right.x * halfW + fwd.x * halfD,
      y: pos.y - right.y * halfW + fwd.y * halfD,
      z: pos.z - right.z * halfW + fwd.z * halfD,
      q: -q,
      bodyId: body.id,
    });
    return;
  }

  const half = poleLength(body) * 0.42;
  const q = poleStrength(body);
  out.push({
    x: pos.x + axis.x * half,
    y: pos.y + axis.y * half,
    z: pos.z + axis.z * half,
    q,
    bodyId: body.id,
  });
  out.push({
    x: pos.x - axis.x * half,
    y: pos.y - axis.y * half,
    z: pos.z - axis.z * half,
    q: -q,
    bodyId: body.id,
  });
}

const _r = vset();

/** B of a magnetic monopole (Gilbert): (μ₀/4π) q r̂ / r² */
export function bFromPoles(point: Vec3, poles: Pole[], excludeId?: string, out?: Vec3) {
  const B = out ?? vset();
  B.x = 0;
  B.y = 0;
  B.z = 0;
  for (const pole of poles) {
    if (excludeId && pole.bodyId === excludeId) continue;
    vsub(point, pole, _r);
    let r = vlen(_r);
    if (r < R_MIN) r = R_MIN;
    const s = (MU0_4PI * pole.q) / (r * r * r);
    B.x += _r.x * s;
    B.y += _r.y * s;
    B.z += _r.z * s;
  }
  return B;
}

export function fieldMagnitude(B: Vec3) {
  return vlen(B);
}

export interface BodySnapshot {
  spec: SimBody;
  pos: Vec3;
  quat: { x: number; y: number; z: number; w: number };
  vel: Vec3;
  ang: Vec3;
}

export interface ForceResult {
  id: string;
  force: Vec3;
  torque: Vec3;
  forceAt: Array<{ point: Vec3; force: Vec3 }>;
}

const _B = vset();
const _F = vset();
const _sample = vset();

export function solveForces(
  snaps: BodySnapshot[],
  gravity: number,
): { forces: ForceResult[]; poles: Pole[]; maxB: number } {
  const poles: Pole[] = [];
  for (const s of snaps) collectPoles(s.spec, s.pos, s.quat, poles);

  const forces: ForceResult[] = snaps.map((s) => ({
    id: s.spec.id,
    force: vset(),
    torque: vset(),
    forceAt: [],
  }));
  const byId = new Map(forces.map((f) => [f.id, f]));
  let maxB = 0;

  // Gilbert pole–pole forces (exact Coulomb analogue).
  for (let i = 0; i < poles.length; i++) {
    const a = poles[i];
    for (let j = i + 1; j < poles.length; j++) {
      const b = poles[j];
      if (a.bodyId === b.bodyId) continue;
      vsub(b, a, _r);
      let r = vlen(_r);
      if (r < R_MIN) r = R_MIN;
      const mag = (MU0_4PI * a.q * b.q) / (r * r);
      const s = mag / r;
      _F.x = _r.x * s;
      _F.y = _r.y * s;
      _F.z = _r.z * s;
      clampMag(_F, F_POLE_CAP);
      const fa = byId.get(a.bodyId);
      const fb = byId.get(b.bodyId);
      if (fa) {
        fa.force.x -= _F.x;
        fa.force.y -= _F.y;
        fa.force.z -= _F.z;
        fa.forceAt.push({
          point: { x: a.x, y: a.y, z: a.z },
          force: { x: -_F.x, y: -_F.y, z: -_F.z },
        });
      }
      if (fb) {
        fb.force.x += _F.x;
        fb.force.y += _F.y;
        fb.force.z += _F.z;
        fb.forceAt.push({
          point: { x: b.x, y: b.y, z: b.z },
          force: { x: _F.x, y: _F.y, z: _F.z },
        });
      }
    }
  }

  for (const snap of snaps) {
    const result = byId.get(snap.spec.id);
    if (!result) continue;
    const spec = snap.spec;

    bFromPoles(snap.pos, poles, spec.id, _B);
    maxB = Math.max(maxB, vlen(_B));

    // Soft ferromagnet: m = (χ V / μ₀) B, saturating, F = ∇(m·B).
    if (spec.kind === "ferromagnetic") {
      applyFerro(snap, poles, result);
    }

    // Diamagnetic mercury (χ < 0) — weak but real.
    if (spec.kind === "mercury" || spec.kind === "pool") {
      applySusceptibility(snap, poles, result);
    }

    // Eddy currents: F ≈ −γ σ V B⊥² v⊥  (Lenz drag) + reaction on sources.
    if (
      spec.kind === "conductor" ||
      spec.kind === "tube" ||
      spec.kind === "mercury" ||
      spec.kind === "pool" ||
      spec.kind === "ferromagnetic"
    ) {
      applyEddy(snap, snaps, poles, result, byId);
    }

    // Mercury bath buoyancy + Stokes-ish viscous drag.
    if (spec.kind !== "pool") {
      applyPools(snap, snaps, result, gravity);
    }

    // Mercury droplet cohesion (surface tension stand-in).
    if (spec.kind === "mercury") {
      applyMercuryCohesion(snap, snaps, result);
    }

    clampMag(result.force, F_BODY_CAP);
    clampMag(result.torque, TAU_CAP);
  }

  return { forces, poles, maxB };
}

function applyFerro(snap: BodySnapshot, poles: Pole[], result: ForceResult) {
  const V = volumeOf(snap.spec.shape, snap.spec.size);
  const chi = Math.max(snap.spec.chi, 1);
  const h = Math.max(characteristicSize(snap.spec.size) * 0.35, 0.006);
  const offsets: Array<[number, number, number]> = [
    [h, 0, 0],
    [-h, 0, 0],
    [0, h, 0],
    [0, -h, 0],
    [0, 0, h],
    [0, 0, -h],
  ];
  const B0 = bFromPoles(snap.pos, poles, snap.spec.id, vset());
  let Bm = vlen(B0);
  if (Bm < 2e-4) return;
  // Saturation: |M| ≤ Ms, M = χ B / μ₀ until Ms.
  const M = Math.min((chi * Bm) / MU0, FERRO_SAT / MU0);
  const scale = (M * V) / Math.max(Bm, 1e-9);

  // F_i = m_j ∂B_j / ∂x_i  (m aligned with B)
  const mx = B0.x * scale;
  const my = B0.y * scale;
  const mz = B0.z * scale;

  const dBx = vset();
  const dBy = vset();
  const dBz = vset();
  for (const [dx, dy, dz] of offsets) {
    _sample.x = snap.pos.x + dx;
    _sample.y = snap.pos.y + dy;
    _sample.z = snap.pos.z + dz;
    const B = bFromPoles(_sample, poles, snap.spec.id, vset());
    const s = 1 / (2 * h);
    if (dx > 0) {
      dBx.x += B.x * s;
      dBy.x += B.y * s;
      dBz.x += B.z * s;
    } else if (dx < 0) {
      dBx.x -= B.x * s;
      dBy.x -= B.y * s;
      dBz.x -= B.z * s;
    } else if (dy > 0) {
      dBx.y += B.x * s;
      dBy.y += B.y * s;
      dBz.y += B.z * s;
    } else if (dy < 0) {
      dBx.y -= B.x * s;
      dBy.y -= B.y * s;
      dBz.y -= B.z * s;
    } else if (dz > 0) {
      dBx.z += B.x * s;
      dBy.z += B.y * s;
      dBz.z += B.z * s;
    } else {
      dBx.z -= B.x * s;
      dBy.z -= B.y * s;
      dBz.z -= B.z * s;
    }
  }

  result.force.x += mx * dBx.x + my * dBy.x + mz * dBz.x;
  result.force.y += mx * dBx.y + my * dBy.y + mz * dBz.y;
  result.force.z += mx * dBx.z + my * dBy.z + mz * dBz.z;

  // τ = m × B
  result.torque.x += my * B0.z - mz * B0.y;
  result.torque.y += mz * B0.x - mx * B0.z;
  result.torque.z += mx * B0.y - my * B0.x;
}

function applySusceptibility(snap: BodySnapshot, poles: Pole[], result: ForceResult) {
  const chi = snap.spec.chi;
  if (Math.abs(chi) < 1e-8) return;
  const V = volumeOf(snap.spec.shape, snap.spec.size);
  const h = 0.008;
  const B0 = bFromPoles(snap.pos, poles, snap.spec.id, vset());
  const energyScale = (chi * V) / MU0;
  // F = (χ V / μ₀) (B · ∇) B
  const dirs: Array<[number, number, number]> = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ];
  for (let i = 0; i < 3; i++) {
    const d = dirs[i];
    _sample.x = snap.pos.x + d[0] * h;
    _sample.y = snap.pos.y + d[1] * h;
    _sample.z = snap.pos.z + d[2] * h;
    const Bp = bFromPoles(_sample, poles, snap.spec.id, vset());
    _sample.x = snap.pos.x - d[0] * h;
    _sample.y = snap.pos.y - d[1] * h;
    _sample.z = snap.pos.z - d[2] * h;
    const Bm = bFromPoles(_sample, poles, snap.spec.id, vset());
    const dB = vset((Bp.x - Bm.x) / (2 * h), (Bp.y - Bm.y) / (2 * h), (Bp.z - Bm.z) / (2 * h));
    const comp = energyScale * vdot(B0, dB);
    if (i === 0) result.force.x += comp;
    if (i === 1) result.force.y += comp;
    if (i === 2) result.force.z += comp;
  }
}

function applyEddy(
  snap: BodySnapshot,
  snaps: BodySnapshot[],
  poles: Pole[],
  result: ForceResult,
  byId: Map<string, ForceResult>,
) {
  const spec = snap.spec;
  const sigma = spec.conductivity;
  if (sigma < 1) return;

  const samples = eddySamples(snap);
  const dV = volumeOf(spec.shape, spec.size) / samples.length;
  const gamma = spec.kind === "tube" ? 0.55 : EDDY_GEO;

  for (const sample of samples) {
    bFromPoles(sample, poles, spec.id, _B);
    const B2 = vdot(_B, _B);
    if (B2 < 1e-8) continue;

    const speed2 =
      snap.vel.x * snap.vel.x + snap.vel.y * snap.vel.y + snap.vel.z * snap.vel.z;
    const moving = speed2 >= 4e-6;

    // Relative velocity vs nearby magnets (sources of B).
    let vx = snap.vel.x;
    let vy = snap.vel.y;
    let vz = snap.vel.z;

    const vDotB = vx * _B.x + vy * _B.y + vz * _B.z;
    const vpx = vx - (vDotB * _B.x) / B2;
    const vpy = vy - (vDotB * _B.y) / B2;
    const vpz = vz - (vDotB * _B.z) / B2;

    if (moving && spec.kind !== "tube" && spec.kind !== "pool" && !spec.anchored) {
      const k = gamma * sigma * dV * B2;
      result.force.x += -k * vpx;
      result.force.y += -k * vpy;
      result.force.z += -k * vpz;
    }

    // Reaction + Lenz drag on moving magnets (tube / plate / Hg).
    for (const other of snaps) {
      if (other.spec.id === spec.id) continue;
      if (other.spec.kind !== "magnet" && other.spec.kind !== "electromagnet") continue;
      const dx = other.pos.x - sample.x;
      const dy = other.pos.y - sample.y;
      const dz = other.pos.z - sample.z;
      const reach = characteristicSize(spec.size) + characteristicSize(other.spec.size);
      if (dx * dx + dy * dy + dz * dz > reach * reach * 4) continue;

      const ovx = other.vel.x - snap.vel.x;
      const ovy = other.vel.y - snap.vel.y;
      const ovz = other.vel.z - snap.vel.z;
      if (ovx * ovx + ovy * ovy + ovz * ovz < 4e-6) continue;
      const oDot = ovx * _B.x + ovy * _B.y + ovz * _B.z;
      const opx = ovx - (oDot * _B.x) / B2;
      const opy = ovy - (oDot * _B.y) / B2;
      const opz = ovz - (oDot * _B.z) / B2;
      const kk = gamma * sigma * dV * B2;
      const ofx = -kk * opx;
      const ofy = -kk * opy;
      const ofz = -kk * opz;
      const fo = byId.get(other.spec.id);
      if (fo) {
        fo.force.x += ofx;
        fo.force.y += ofy;
        fo.force.z += ofz;
      }
    }

    // Magnetic damping of spin: τ ∝ −σ V B² ω
    const spinK = gamma * 0.04 * sigma * dV * B2;
    result.torque.x -= spinK * snap.ang.x;
    result.torque.y -= spinK * snap.ang.y;
    result.torque.z -= spinK * snap.ang.z;
  }
}

function eddySamples(snap: BodySnapshot): Vec3[] {
  const { spec, pos } = snap;
  if (spec.kind === "tube") {
    const r = spec.size[0] / 2 - 0.002;
    const h = spec.size[1];
    const pts: Vec3[] = [];
    for (let ring = -1; ring <= 1; ring++) {
      const y = pos.y + ring * (h * 0.32);
      for (let k = 0; k < 6; k++) {
        const a = (k / 6) * Math.PI * 2;
        pts.push(vset(pos.x + Math.cos(a) * r, y, pos.z + Math.sin(a) * r));
      }
    }
    return pts;
  }
  if (spec.kind === "pool") {
    const r = spec.size[0] / 2;
    const pts: Vec3[] = [vcopy(pos, vset())];
    for (let k = 0; k < 4; k++) {
      const a = (k / 4) * Math.PI * 2;
      pts.push(vset(pos.x + Math.cos(a) * r * 0.55, pos.y, pos.z + Math.sin(a) * r * 0.55));
    }
    return pts;
  }
  return [vcopy(pos, vset())];
}

function applyPools(
  snap: BodySnapshot,
  snaps: BodySnapshot[],
  result: ForceResult,
  gravity: number,
) {
  for (const other of snaps) {
    if (other.spec.kind !== "pool") continue;
    const pr = other.spec.size[0] / 2;
    const ph = other.spec.size[1];
    const dx = snap.pos.x - other.pos.x;
    const dz = snap.pos.z - other.pos.z;
    const rad = Math.hypot(dx, dz);
    const bodyR = characteristicSize(snap.spec.size) * 0.5;
    if (rad > pr + bodyR) continue;

    const surface = other.pos.y + ph / 2;
    const floor = other.pos.y - ph / 2;
    const top = snap.pos.y + bodyR;
    const bot = snap.pos.y - bodyR;
    if (bot > surface || top < floor) continue;

    const immersedTop = Math.min(top, surface);
    const immersedBot = Math.max(bot, floor);
    const immersed = Math.max(0, immersedTop - immersedBot);
    const frac = Math.min(1, immersed / Math.max(2 * bodyR, 1e-4));
    const V = volumeOf(snap.spec.shape, snap.spec.size) * frac;
    const lift = other.spec.density * V * Math.abs(gravity);
    result.force.y += gravity <= 0 ? lift : -lift;

    // Light viscous drag (η_Hg ≈ 1.55 mPa·s — similar to water).
    const eta = 0.00155;
    const drag = 6 * Math.PI * eta * bodyR * 40;
    result.force.x -= drag * snap.vel.x;
    result.force.y -= drag * snap.vel.y;
    result.force.z -= drag * snap.vel.z;
  }
}

function applyMercuryCohesion(
  snap: BodySnapshot,
  snaps: BodySnapshot[],
  result: ForceResult,
) {
  for (const other of snaps) {
    if (other.spec.id === snap.spec.id) continue;
    if (other.spec.kind !== "mercury" && other.spec.kind !== "pool") continue;
    vsub(other.pos, snap.pos, _r);
    const d = vlen(_r);
    const rest =
      other.spec.kind === "pool"
        ? other.spec.size[0] * 0.35
        : (snap.spec.size[0] + other.spec.size[0]) * 0.42;
    if (d < 1e-4 || d > rest * 1.8) continue;
    const k = 1.8;
    const stretch = d - rest;
    const s = (-k * stretch) / d;
    result.force.x += _r.x * s;
    result.force.y += _r.y * s;
    result.force.z += _r.z * s;
  }
}

export function formatTesla(B: number) {
  if (B >= 0.1) return `${B.toFixed(3)} T`;
  if (B >= 0.001) return `${(B * 1e3).toFixed(2)} mT`;
  return `${(B * 1e4).toFixed(2)} G`;
}

export function dipoleMomentMagnitude(body: SimBody) {
  return Math.abs(poleStrength(body) * poleLength(body));
}
