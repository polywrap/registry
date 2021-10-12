import { ethers } from "ethers";
import { SupportedNetwork } from "../constants";

export type Web3 = {
  account: string;
  signer: ethers.Signer;
  ethereumProvider: any;
  provider: ethers.providers.Provider;
  networkName: SupportedNetwork;
  chainId: number;
};
