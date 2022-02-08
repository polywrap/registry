import { PackageOwner, PolywrapVotingSystem } from "@polywrap/registry-js";
import React from "react";

export const PolywrapRegistryContext = React.createContext<
  | {
      packageOwner: PackageOwner;
      polywrapVotingSystem: PolywrapVotingSystem;
    }
  | undefined
>(undefined);
