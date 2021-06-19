import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { TestENSRegistry, TestPublicResolver } from "../../../typechain";

export type ENSApi = {
  ensRegistry: TestENSRegistry,
  ensPublicResolver: TestPublicResolver,
  registerDomainName: (domainOwner: string, domainName: string) => Promise<void>;
  setPolywrapController: (domainOwner: SignerWithAddress, domainName: string, controllerAddress: string) => Promise<void>;
  getPolywrapController: (domainName: string) => Promise<string>;
};