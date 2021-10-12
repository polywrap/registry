import { PackageOwner } from "@polywrap/registry-js";
import React from "react";
import { PolywrapRegistryContext } from "../providers/PolywrapRegistryContext";

export const usePolywrapRegistry = (): {
  packageOwner: PackageOwner;
} => {
  const registry = React.useContext(PolywrapRegistryContext);

  if (!registry) {
    throw "Registry not defined";
  }

  return registry;
};
