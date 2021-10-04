import React from "react";
import { Web3Context } from "../providers/Web3Context";
import { Web3 } from "../types/Web3";

export const useWeb3 = (): Web3 | undefined => {
  const web3 = React.useContext(Web3Context);

  return web3;
};
