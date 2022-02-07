import { PolywrapRegistry } from "@polywrap/registry-js";
import React from "react";
import { PolywrapRegistryContext } from "../providers/PolywrapRegistryContext";

export const usePolywrapRegistry = (): PolywrapRegistry => {
  const registry = React.useContext(PolywrapRegistryContext);

  if (!registry) {
    throw "Registry not defined";
  }

  return registry;
};
