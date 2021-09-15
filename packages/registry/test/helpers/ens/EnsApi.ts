import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { EnsDomain } from "registry-core-js";

export const POLYWRAP_OWNER_RECORD_NAME = "polywrap-owner";
const rootNode = ethers.utils.zeroPad([0], 32);

export class EnsApi {
  ensRegistry: Contract | undefined;
  ethRegistrar: Contract | undefined;
  ensPublicResolver: Contract | undefined;

  async init(): Promise<void> {
    this.ensRegistry = await ethers.getContract("EnsRegistryL1");
    this.ethRegistrar = await ethers.getContract("TestEthRegistrarL1");
    this.ensPublicResolver = await ethers.getContract("TestPublicResolverL1");
  }

  async registerDomainName(
    domainOwner: Signer,
    domain: EnsDomain
  ): Promise<void> {
    await this.ethRegistrar!.register(
      domain.labelHash,
      await domainOwner.getAddress(),
      10 * 60
    );
    const ownedRegistry = this.ensRegistry!.connect(domainOwner);

    await ownedRegistry.setResolver(
      domain.node,
      this.ensPublicResolver!.address
    );
  }

  async setPolywrapOwner(
    domainOwner: Signer,
    domain: EnsDomain,
    ownerAddress: string
  ): Promise<void> {
    const ownedPublicResolver = this.ensPublicResolver!.connect(domainOwner);

    const tx = await ownedPublicResolver.setText(
      domain.node,
      POLYWRAP_OWNER_RECORD_NAME,
      ownerAddress
    );
    await tx.wait();
  }

  async getPolywrapOwner(domain: EnsDomain): Promise<string> {
    return await this.ensPublicResolver!.text(
      domain.node,
      POLYWRAP_OWNER_RECORD_NAME
    );
  }
}
