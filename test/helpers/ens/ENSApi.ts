import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

export type ENSApi = {
  registerDomainName: (domainOwner: string, domainName: string) => Promise<void>;
  setPolywrapController: (domainOwner: SignerWithAddress, domainName: string, controllerAddress: string) => Promise<void>;
  getPolywrapController: (domainName: string) => Promise<string>;
};