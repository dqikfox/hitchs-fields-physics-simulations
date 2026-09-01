import {
  CuboidCollider,
  CylinderCollider,
  RigidBody,
  type RapierRigidBody,
} from "@react-three/rapier";
import { useRef } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { useBodyRegistry } from "./registry";
import { useSim } from "./store";
import type { SimBody } from "./types";

export function Bodies() {
  const bodies = useSim((s) => s.bodies);
  return (
    <>
      {bodies.map((body) => (
        <SimBodyMesh key={body.id} spec={body} />
      ))}
    </>
  );
}

function SimBodyMesh({ spec }: { spec: SimBody }) {
  const registry = useBodyRegistry();
  const select = useSim((s) => s.select);
  const selected = useSim((s) => s.selectedId === spec.id);
  const rbRef = useRef<RapierRigidBody | null>(null);

  const type = spec.kind === "pool"
    ? "fixed"
    : spec.anchored
      ? "kinematicPosition"
      : "dynamic";

  const bind = (rb: RapierRigidBody | null) => {
    rbRef.current = rb;
    if (rb) registry.set(spec.id, rb);
    else registry.delete(spec.id);
  };

  const onDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    select(spec.id);
    if (spec.kind === "pool") return;
    const rb = rbRef.current;
    if (!rb) return;
    const t = rb.translation();
    const grab = e.point;
    dragOffset.x = t.x - grab.x;
    dragOffset.y = t.y - grab.y;
    dragOffset.z = t.z - grab.z;
    dragPlaneY = grab.y;
    useSim.getState().setDragging(spec.id);
  };

  const autoColliders =
    spec.shape === "box" ? "cuboid" : spec.shape === "sphere" ? "ball" : false;

  return (
    <RigidBody
      ref={bind}
      position={spec.position}
      rotation={spec.rotation}
      type={type}
      mass={spec.mass}
      colliders={autoColliders}
      linearDamping={0.42}
      angularDamping={0.58}
      friction={0.62}
      restitution={0.08}
      ccd={false}
      canSleep
    >
      {spec.shape === "tube" ? <TubeColliders spec={spec} /> : null}
      {spec.shape === "horseshoe" ? <HorseshoeColliders spec={spec} /> : null}
      {spec.shape === "coil" || spec.shape === "cylinder" ? (
        <CylinderCollider args={[spec.size[1] / 2, spec.size[0] / 2]} />
      ) : null}
      {spec.shape === "pool" ? (
        <CylinderCollider
          args={[0.002, spec.size[0] / 2]}
          position={[0, -spec.size[1] / 2, 0]}
        />
      ) : null}

      <group onPointerDown={onDown}>
        <BodyVisual spec={spec} selected={selected} />
      </group>
    </RigidBody>
  );
}

export const dragOffset = { x: 0, y: 0, z: 0 };
export let dragPlaneY = 0.08;

function TubeColliders({ spec }: { spec: SimBody }) {
  const r = spec.size[0] / 2;
  const h = spec.size[1];
  const t = 0.0035;
  const n = 6;
  const seg = ((2 * Math.PI * r) / n) * 0.62;
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2;
        return (
          <CuboidCollider
            key={i}
            args={[t, h / 2, seg]}
            position={[Math.cos(a) * (r - t), 0, Math.sin(a) * (r - t)]}
            rotation={[0, -a, 0]}
          />
        );
      })}
    </>
  );
}

function HorseshoeColliders({ spec }: { spec: SimBody }) {
  const [sx, sy, sz] = spec.size;
  return (
    <>
      <CuboidCollider
        args={[sx * 0.12, sy * 0.45, sz * 0.45]}
        position={[-sx * 0.32, 0, 0]}
      />
      <CuboidCollider
        args={[sx * 0.12, sy * 0.45, sz * 0.45]}
        position={[sx * 0.32, 0, 0]}
      />
      <CuboidCollider
        args={[sx * 0.48, sy * 0.14, sz * 0.45]}
        position={[0, sy * 0.28, 0]}
      />
    </>
  );
}

function BodyVisual({ spec, selected }: { spec: SimBody; selected: boolean }) {
  const outline = selected ? 0.012 : 0;
  switch (spec.shape) {
    case "box":
      return <BarVisual spec={spec} outline={outline} />;
    case "cylinder":
      return <DiscVisual spec={spec} outline={outline} />;
    case "sphere":
      return <SphereVisual spec={spec} outline={outline} />;
    case "coil":
      return <CoilVisual spec={spec} outline={outline} />;
    case "horseshoe":
      return <HorseshoeVisual spec={spec} outline={outline} />;
    case "tube":
      return <TubeVisual spec={spec} outline={outline} />;
    case "pool":
      return <PoolVisual spec={spec} selected={selected} />;
    default:
      return <BarVisual spec={spec} outline={outline} />;
  }
}

function northColor(polarity: 1 | -1) {
  return polarity === 1 ? "#c45c5c" : "#4d7ab8";
}
function southColor(polarity: 1 | -1) {
  return polarity === 1 ? "#4d7ab8" : "#c45c5c";
}

function BarVisual({ spec, outline }: { spec: SimBody; outline: number }) {
  const [sx, sy, sz] = spec.size;
  const axis = spec.momentAxis;
  const isMag = spec.kind === "magnet";
  return (
    <group>
      {isMag && axis === "z" ? (
        <>
          <mesh position={[0, 0, sz * 0.25]} castShadow receiveShadow>
            <boxGeometry args={[sx, sy, sz * 0.5]} />
            <meshStandardMaterial
              color={northColor(spec.polarity)}
              metalness={0.55}
              roughness={0.38}
              emissive={northColor(spec.polarity)}
              emissiveIntensity={0.08}
            />
          </mesh>
          <mesh position={[0, 0, -sz * 0.25]} castShadow receiveShadow>
            <boxGeometry args={[sx, sy, sz * 0.5]} />
            <meshStandardMaterial
              color={southColor(spec.polarity)}
              metalness={0.55}
              roughness={0.38}
              emissive={southColor(spec.polarity)}
              emissiveIntensity={0.08}
            />
          </mesh>
        </>
      ) : isMag && axis === "y" ? (
        <>
          <mesh position={[0, sy * 0.25, 0]} castShadow receiveShadow>
            <boxGeometry args={[sx, sy * 0.5, sz]} />
            <meshStandardMaterial
              color={northColor(spec.polarity)}
              metalness={0.55}
              roughness={0.38}
              emissive={northColor(spec.polarity)}
              emissiveIntensity={0.08}
            />
          </mesh>
          <mesh position={[0, -sy * 0.25, 0]} castShadow receiveShadow>
            <boxGeometry args={[sx, sy * 0.5, sz]} />
            <meshStandardMaterial
              color={southColor(spec.polarity)}
              metalness={0.55}
              roughness={0.38}
              emissive={southColor(spec.polarity)}
              emissiveIntensity={0.08}
            />
          </mesh>
        </>
      ) : (
        <mesh castShadow receiveShadow>
          <boxGeometry args={[sx, sy, sz]} />
          <meshStandardMaterial
            color={spec.color}
            metalness={spec.kind === "conductor" ? 0.85 : 0.4}
            roughness={spec.kind === "conductor" ? 0.28 : 0.5}
          />
        </mesh>
      )}
      {outline > 0 ? (
        <mesh>
          <boxGeometry args={[sx + outline, sy + outline, sz + outline]} />
          <meshBasicMaterial color="#e8e6e1" wireframe transparent opacity={0.5} />
        </mesh>
      ) : null}
    </group>
  );
}

function DiscVisual({ spec, outline }: { spec: SimBody; outline: number }) {
  const r = spec.size[0] / 2;
  const h = spec.size[1];
  const mag = spec.kind === "magnet";
  return (
    <group>
      {mag ? (
        <>
          <mesh position={[0, h * 0.25, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[r, r, h * 0.5, 16]} />
            <meshStandardMaterial
              color={northColor(spec.polarity)}
              metalness={0.58}
              roughness={0.32}
              emissive={northColor(spec.polarity)}
              emissiveIntensity={0.08}
            />
          </mesh>
          <mesh position={[0, -h * 0.25, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[r, r, h * 0.5, 16]} />
            <meshStandardMaterial
              color={southColor(spec.polarity)}
              metalness={0.58}
              roughness={0.32}
              emissive={southColor(spec.polarity)}
              emissiveIntensity={0.08}
            />
          </mesh>
        </>
      ) : (
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[r, r, h, 18]} />
          <meshStandardMaterial
            color={spec.color}
            metalness={0.82}
            roughness={0.26}
          />
        </mesh>
      )}
      {outline > 0 ? (
        <mesh>
          <cylinderGeometry args={[r + outline, r + outline, h + outline, 16]} />
          <meshBasicMaterial color="#e8e6e1" wireframe transparent opacity={0.45} />
        </mesh>
      ) : null}
    </group>
  );
}

function SphereVisual({ spec, outline }: { spec: SimBody; outline: number }) {
  const r = spec.size[0] / 2;
  const mercury = spec.kind === "mercury";
  return (
    <group>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[r, 16, 12]} />
        <meshStandardMaterial
          color={spec.color}
          metalness={mercury ? 0.55 : 0.7}
          roughness={mercury ? 0.32 : 0.35}
        />
      </mesh>
      {outline > 0 ? (
        <mesh>
          <sphereGeometry args={[r + outline, 12, 10]} />
          <meshBasicMaterial color="#e8e6e1" wireframe transparent opacity={0.45} />
        </mesh>
      ) : null}
    </group>
  );
}

function CoilVisual({ spec, outline }: { spec: SimBody; outline: number }) {
  const r = spec.size[0] / 2;
  const h = spec.size[1];
  const live = spec.powered && spec.voltage > 0.2;
  return (
    <group>
      <mesh castShadow>
        <cylinderGeometry args={[r * 0.38, r * 0.38, h * 0.92, 20]} />
        <meshStandardMaterial color="#3d4046" metalness={0.7} roughness={0.35} />
      </mesh>
      {[-0.28, 0.04, 0.34].map((t) => (
        <mesh key={t} position={[0, h * t, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[r * 0.62, r * 0.1, 6, 14]} />
          <meshStandardMaterial
            color="#b87333"
            metalness={0.85}
            roughness={0.28}
            emissive={live ? "#b87333" : "#000000"}
            emissiveIntensity={live ? 0.18 : 0}
          />
        </mesh>
      ))}
      <mesh position={[0, h * 0.48, 0]}>
        <cylinderGeometry args={[r * 0.38, r * 0.38, 0.004, 16]} />
        <meshStandardMaterial
          color={northColor(spec.polarity)}
          emissive={northColor(spec.polarity)}
          emissiveIntensity={live ? 0.35 : 0.05}
        />
      </mesh>
      <mesh position={[0, -h * 0.48, 0]}>
        <cylinderGeometry args={[r * 0.38, r * 0.38, 0.004, 16]} />
        <meshStandardMaterial
          color={southColor(spec.polarity)}
          emissive={southColor(spec.polarity)}
          emissiveIntensity={live ? 0.35 : 0.05}
        />
      </mesh>
      {outline > 0 ? (
        <mesh>
          <cylinderGeometry args={[r + 0.004, r + 0.004, h + 0.01, 12]} />
          <meshBasicMaterial color="#e8e6e1" wireframe transparent opacity={0.4} />
        </mesh>
      ) : null}
    </group>
  );
}

function HorseshoeVisual({ spec, outline }: { spec: SimBody; outline: number }) {
  const [sx, sy, sz] = spec.size;
  return (
    <group>
      <mesh position={[-sx * 0.32, 0, 0]} castShadow>
        <boxGeometry args={[sx * 0.24, sy, sz]} />
        <meshStandardMaterial
          color={northColor(spec.polarity)}
          metalness={0.45}
          roughness={0.45}
        />
      </mesh>
      <mesh position={[sx * 0.32, 0, 0]} castShadow>
        <boxGeometry args={[sx * 0.24, sy, sz]} />
        <meshStandardMaterial
          color={southColor(spec.polarity)}
          metalness={0.45}
          roughness={0.45}
        />
      </mesh>
      <mesh position={[0, sy * 0.3, 0]} castShadow>
        <boxGeometry args={[sx, sy * 0.28, sz]} />
        <meshStandardMaterial color="#8a3d3d" metalness={0.4} roughness={0.5} />
      </mesh>
      {outline > 0 ? (
        <mesh>
          <boxGeometry args={[sx + 0.01, sy + 0.01, sz + 0.01]} />
          <meshBasicMaterial color="#e8e6e1" wireframe transparent opacity={0.35} />
        </mesh>
      ) : null}
    </group>
  );
}

function TubeVisual({ spec, outline }: { spec: SimBody; outline: number }) {
  const r = spec.size[0] / 2;
  const h = spec.size[1];
  return (
    <group>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[r, r, h, 18, 1, true]} />
        <meshStandardMaterial
          color="#b87333"
          metalness={0.86}
          roughness={0.24}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh>
        <cylinderGeometry args={[r - 0.0035, r - 0.0035, h, 18, 1, true]} />
        <meshStandardMaterial
          color="#8a5524"
          metalness={0.8}
          roughness={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      {outline > 0 ? (
        <mesh>
          <cylinderGeometry args={[r + 0.004, r + 0.004, h + 0.008, 12, 1, true]} />
          <meshBasicMaterial color="#e8e6e1" wireframe transparent opacity={0.4} />
        </mesh>
      ) : null}
    </group>
  );
}

function PoolVisual({ spec, selected }: { spec: SimBody; selected: boolean }) {
  const r = spec.size[0] / 2;
  const h = spec.size[1];
  return (
    <group>
      <mesh position={[0, -h * 0.15, 0]} receiveShadow>
        <cylinderGeometry args={[r + 0.008, r + 0.01, h * 0.7, 24]} />
        <meshStandardMaterial color="#2a2d32" metalness={0.4} roughness={0.55} />
      </mesh>
      <mesh position={[0, h * 0.12, 0]} receiveShadow>
        <cylinderGeometry args={[r, r, h * 0.55, 24]} />
        <meshStandardMaterial
          color="#b7bbc0"
          metalness={0.42}
          roughness={0.38}
        />
      </mesh>
      {selected ? (
        <mesh position={[0, h * 0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[r + 0.002, r + 0.008, 24]} />
          <meshBasicMaterial color="#e8e6e1" transparent opacity={0.5} />
        </mesh>
      ) : null}
    </group>
  );
}
