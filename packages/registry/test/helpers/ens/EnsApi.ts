import hre, { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { EnsDomain } from "@polywrap/registry-core-js";
import { ENSRegistry, ENSRegistry__factory, TestEthRegistrar, TestEthRegistrar__factory, TestPublicResolver, TestPublicResolver__factory } from "../../../typechain";
import { BaseProvider } from "@ethersproject/providers";

export const POLYWRAP_OWNER_RECORD_NAME = "polywrap-owner";
const rootNode = ethers.utils.zeroPad([0], 32);

export class EnsApi {
  private ensRegistryL1: ENSRegistry;
  private testEthRegistrarL1: TestEthRegistrar;
  private testPublicResolverL1: TestPublicResolver;

  constructor(contractAddresses: {
    ensRegistryL1: string,
    testEthRegistrarL1: string,
    testPublicResolverL1: string,
  }, provider: BaseProvider) {
    this.ensRegistryL1 = ENSRegistry__factory.connect(contractAddresses.ensRegistryL1, provider);
    this.testEthRegistrarL1 = TestEthRegistrar__factory.connect(contractAddresses.testEthRegistrarL1, provider);
    this.testPublicResolverL1 = TestPublicResolver__factory.connect(contractAddresses.testPublicResolverL1, provider);
  }

  async registerDomainName(
    owner: Signer,
    domainOwner: Signer,
    domain: EnsDomain
  ): Promise<void> {
    let tx = await this.testEthRegistrarL1.connect(owner).addController(
      await domainOwner.getAddress()
    );

    await tx.wait();

    tx = await this.testEthRegistrarL1.connect(domainOwner).register(
      domain.labelHash,
      await domainOwner.getAddress(),
      10 * 60
    );

    await tx.wait();

    const ownedRegistry = this.ensRegistryL1.connect(domainOwner);

    tx = await ownedRegistry.setResolver(
      domain.node,
      this.testPublicResolverL1!.address
    );

    await tx.wait();
  }

  async setPolywrapOwner(
    domainOwner: Signer,
    domain: EnsDomain
  ): Promise<void> {
    const ownedPublicResolver = this.testPublicResolverL1.connect(domainOwner);

    const tx = await ownedPublicResolver.setText(
      domain.node,
      POLYWRAP_OWNER_RECORD_NAME,
      await domainOwner.getAddress()
    );

    await tx.wait();
  }

  async getPolywrapOwner(domain: EnsDomain): Promise<string> {
    return await this.testPublicResolverL1.text(
      domain.node,
      POLYWRAP_OWNER_RECORD_NAME
    );
  }
}
