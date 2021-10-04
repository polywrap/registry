import React from "react";
import { Web3 } from "../types/Web3";

export const Web3Context = React.createContext<
  [Web3 | undefined, (web3: Web3 | undefined) => void]
>([undefined, () => undefined]);
