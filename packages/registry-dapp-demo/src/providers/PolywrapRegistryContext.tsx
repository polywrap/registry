import { PackageOwner } from "@polywrap/registry-js";
import React from "react";

export const PolywrapRegistryContext = React.createContext<
  | {
      packageOwner: PackageOwner;
    }
  | undefined
>(undefined);
