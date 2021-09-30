import { ethers } from "ethers";

export type Web3 = {
  account: string;
  signer: ethers.Signer;
  ethereumProvider: any;
  provider: ethers.providers.Provider;
  networkName: string;
  chainId: number;
};
