import type { RapierRigidBody } from "@react-three/rapier";
import { createContext, useContext } from "react";

export type BodyRegistry = Map<string, RapierRigidBody>;

export const RegistryContext = createContext<BodyRegistry>(new Map());

export function useBodyRegistry() {
  return useContext(RegistryContext);
}
