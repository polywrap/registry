import { PolywrapRegistry } from "@polywrap/registry-js";
import React from "react";

export const PolywrapRegistryContext = React.createContext<
  PolywrapRegistry | undefined
>(undefined);
