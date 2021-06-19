import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { TestENSRegistry, TestEthRegistrar, TestPublicResolver } from "../../../typechain";

export type ENSApi = {
  ensRegistry: TestENSRegistry,
  ethRegistrar: TestEthRegistrar,
  ensPublicResolver: TestPublicResolver,
  registerDomainName: (domainOwner: SignerWithAddress, domainName: string) => Promise<void>;
  setPolywrapController: (domainOwner: SignerWithAddress, domainName: string, controllerAddress: string) => Promise<void>;
  getPolywrapController: (domainName: string) => Promise<string>;
};