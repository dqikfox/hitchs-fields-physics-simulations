import { OrbitControls } from "@react-three/drei/core/OrbitControls";
import { useFrame, useThree } from "@react-three/fiber";
import { CuboidCollider, Physics, RigidBody, type RapierRigidBody } from "@react-three/rapier";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Bodies, dragOffset, dragPlaneY } from "./Bodies";
import { FieldVis } from "./FieldVis";
import { MagnetForces } from "./MagnetForces";
import { useBodyRegistry } from "./registry";
import { useSim } from "./store";

type OrbitLike = {
  target: THREE.Vector3;
};

export function World() {
  const gravity = useSim((s) => s.gravity);
  const paused = useSim((s) => s.paused);
  const draggingId = useSim((s) => s.draggingId);
  const epoch = useSim((s) => s.epoch);
  const [tabHidden, setTabHidden] = useState(false);

  useEffect(() => {
    const onVis = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <>
      <color attach="background" args={["#0b0c0e"]} />
      <fog attach="fog" args={["#0b0c0e", 1.6, 4.2]} />
      <hemisphereLight args={["#d8d4cc", "#1a1c20", 0.55]} />
      <directionalLight position={[0.7, 1.4, 0.5]} intensity={1.35} />
      <directionalLight position={[-0.6, 0.5, -0.4]} intensity={0.25} color="#8aa0b8" />

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        enablePan
        enabled={!draggingId}
        minDistance={0.18}
        maxDistance={2.4}
        maxPolarAngle={Math.PI * 0.49}
        target={[0, 0.06, 0]}
      />
      <CameraRig />
      <DragController />

      <mesh position={[0, -0.025, 0]} receiveShadow>
        <boxGeometry args={[1.5, 0.05, 1.0]} />
        <meshStandardMaterial color="#16181c" metalness={0.35} roughness={0.62} />
      </mesh>
      <Suspense fallback={null}>
        <Physics
          gravity={[0, -gravity, 0]}
          timeStep="vary"
          paused={paused || tabHidden}
          interpolate={false}
          debug={false}
        >
          <Table />
          <Bodies key={epoch} />
          <MagnetForces />
        </Physics>
      </Suspense>

      <FieldVis />
    </>
  );
}

function Table() {
  return (
    <>
      <RigidBody type="fixed" colliders="cuboid" friction={0.7} restitution={0.05}>
        <mesh position={[0, -0.025, 0]} receiveShadow>
          <boxGeometry args={[1.5, 0.05, 1.0]} />
          <meshStandardMaterial color="#16181c" metalness={0.35} roughness={0.62} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[0.02, 0.34, 0.52]} position={[-0.77, 0.34, 0]} />
        <CuboidCollider args={[0.02, 0.34, 0.52]} position={[0.77, 0.34, 0]} />
        <CuboidCollider args={[0.77, 0.34, 0.02]} position={[0, 0.34, -0.52]} />
        <CuboidCollider args={[0.77, 0.34, 0.02]} position={[0, 0.34, 0.52]} />
        <CuboidCollider args={[0.78, 0.02, 0.52]} position={[0, 0.72, 0]} />
      </RigidBody>
      <gridHelper
        args={[1.5, 15, "#2a2d34", "#1c1f26"]}
        position={[0, 0.001, 0]}
      />
      <mesh position={[0, -0.052, 0]} receiveShadow>
        <boxGeometry args={[1.56, 0.02, 1.06]} />
        <meshStandardMaterial color="#0e1013" metalness={0.2} roughness={0.8} />
      </mesh>
    </>
  );
}

function CameraRig() {
  const keys = useRef(new Set<string>());
  const { camera, controls } = useThree();
  const forward = useMemo(() => new THREE.Vector3(), []);
  const right = useMemo(() => new THREE.Vector3(), []);
  const worldUp = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const move = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (isTyping(e)) return;
      keys.current.add(e.code);
    };
    const upKey = (e: KeyboardEvent) => keys.current.delete(e.code);
    const clear = () => keys.current.clear();
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", upKey);
    window.addEventListener("blur", clear);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", upKey);
      window.removeEventListener("blur", clear);
    };
  }, []);

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.1);
    const orbit = controls as unknown as OrbitLike | null;
    if (!orbit) return;
    const k = keys.current;
    camera.getWorldDirection(forward);
    forward.y = 0;
    if (forward.lengthSq() < 1e-6) forward.set(0, 0, -1);
    forward.normalize();
    right.crossVectors(forward, worldUp).normalize();

    let sx = 0;
    let sz = 0;
    let sy = 0;
    if (k.has("KeyA") || k.has("ArrowLeft")) sx -= 1;
    if (k.has("KeyD") || k.has("ArrowRight")) sx += 1;
    if (k.has("KeyW") || k.has("ArrowUp")) sz += 1;
    if (k.has("KeyS") || k.has("ArrowDown")) sz -= 1;
    if (k.has("KeyQ")) sy -= 1;
    if (k.has("KeyE")) sy += 1;
    if (!sx && !sz && !sy) return;

    const speed = (k.has("ShiftLeft") || k.has("ShiftRight") ? 0.9 : 0.42) * d;
    move
      .set(0, 0, 0)
      .addScaledVector(right, sx * speed)
      .addScaledVector(forward, sz * speed)
      .addScaledVector(worldUp, sy * speed);
    orbit.target.add(move);
    camera.position.add(move);
  });

  return null;
}

function DragController() {
  const registry = useBodyRegistry();
  const draggingId = useSim((s) => s.draggingId);
  const setDragging = useSim((s) => s.setDragging);
  const { camera, gl } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const pointer = useMemo(() => new THREE.Vector2(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const hit = useMemo(() => new THREE.Vector3(), []);
  const planeN = useMemo(() => new THREE.Vector3(), []);
  const camDir = useMemo(() => new THREE.Vector3(), []);
  const shift = useRef(false);
  const last = useRef(new THREE.Vector3());
  const lastT = useRef(0);

  useEffect(() => {
    const onUp = () => {
      const id = useSim.getState().draggingId;
      if (!id) return;
      const rb = registry.get(id);
      if (rb) {
        const spec = useSim.getState().bodies.find((b) => b.id === id);
        setBodyTypeSafe(rb, spec?.anchored ? 2 : 0);
        const now = performance.now();
        const dt = Math.max((now - lastT.current) / 1000, 1 / 120);
        const t = rb.translation();
        const vx = (t.x - last.current.x) / dt;
        const vy = (t.y - last.current.y) / dt;
        const vz = (t.z - last.current.z) / dt;
        rb.setLinvel(
          {
            x: THREE.MathUtils.clamp(vx, -1.5, 1.5),
            y: THREE.MathUtils.clamp(vy, -1.5, 1.5),
            z: THREE.MathUtils.clamp(vz, -1.5, 1.5),
          },
          true,
        );
      }
      setDragging(null);
    };
    const onKey = (e: KeyboardEvent) => {
      shift.current = e.shiftKey;
    };
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    return () => {
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
    };
  }, [registry, setDragging]);

  useFrame(() => {
    if (!draggingId) return;
    const rb = registry.get(draggingId);
    if (!rb) return;
    setBodyTypeSafe(rb, 2);
    const rect = gl.domElement.getBoundingClientRect();
    const ev = latestPointer;
    pointer.x = ((ev.x - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((ev.y - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);

    if (shift.current) {
      camera.getWorldDirection(camDir);
      camDir.y = 0;
      camDir.normalize();
      planeN.crossVectors(camDir, new THREE.Vector3(0, 1, 0)).normalize();
      const t = rb.translation();
      plane.setFromNormalAndCoplanarPoint(planeN, new THREE.Vector3(t.x, t.y, t.z));
    } else {
      plane.set(new THREE.Vector3(0, 1, 0), -dragPlaneY);
    }

    if (!raycaster.ray.intersectPlane(plane, hit)) return;
    const next = {
      x: hit.x + dragOffset.x,
      y: shift.current ? hit.y + dragOffset.y : dragPlaneY + dragOffset.y,
      z: hit.z + dragOffset.z,
    };
    next.x = THREE.MathUtils.clamp(next.x, -0.7, 0.7);
    next.y = THREE.MathUtils.clamp(next.y, 0.02, 0.55);
    next.z = THREE.MathUtils.clamp(next.z, -0.46, 0.46);
    last.current.set(rb.translation().x, rb.translation().y, rb.translation().z);
    lastT.current = performance.now();
    rb.setNextKinematicTranslation(next);
  });

  return null;
}

function setBodyTypeSafe(rb: RapierRigidBody, type: number) {
  const typed = rb as RapierRigidBody & {
    setBodyType?: (t: number, wake: boolean) => void;
  };
  if (typeof typed.setBodyType === "function") typed.setBodyType(type, true);
}

const latestPointer = { x: 0, y: 0 };

if (typeof window !== "undefined") {
  window.addEventListener(
    "pointermove",
    (e) => {
      latestPointer.x = e.clientX;
      latestPointer.y = e.clientY;
    },
    { passive: true },
  );
}

function isTyping(e: KeyboardEvent) {
  const t = e.target as HTMLElement | null;
  if (!t) return false;
  const tag = t.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || t.isContentEditable;
}
