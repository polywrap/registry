import React from "react";
import { Web3Context } from "../providers/Web3Context";
import { Web3 } from "../types/Web3";

export const useWeb3Context = (): [
  Web3 | undefined,
  React.Dispatch<React.SetStateAction<Web3 | undefined>>
] => React.useContext(Web3Context);
