import { ethers, Signer } from "ethers";
import { EnsDomain } from "@polywrap/registry-js";
import {
  ENSRegistry,
  TestEthRegistrar,
  TestPublicResolver,
} from "../../../typechain";

export const POLYWRAP_OWNER_RECORD_NAME = "polywrap-owner";
const rootNode = ethers.utils.zeroPad([0], 32);

export class EnsApi {
  private ensRegistryL1: ENSRegistry;
  private testEthRegistrarL1: TestEthRegistrar;
  private testPublicResolverL1: TestPublicResolver;

  constructor(deps: {
    ensRegistryL1: ENSRegistry;
    testEthRegistrarL1: TestEthRegistrar;
    testPublicResolverL1: TestPublicResolver;
  }) {
    this.ensRegistryL1 = deps.ensRegistryL1;
    this.testEthRegistrarL1 = deps.testEthRegistrarL1;
    this.testPublicResolverL1 = deps.testPublicResolverL1;
  }

  async registerDomainName(
    domainOwner: Signer,
    domain: EnsDomain
  ): Promise<void> {
    console.log("registerDomainName 1");
    await this.testEthRegistrarL1.register(
      domain.labelHash,
      await domainOwner.getAddress(),
      10 * 60
    );
    console.log("registerDomainName 2");
    const ownedRegistry = this.ensRegistryL1.connect(domainOwner);
    console.log("registerDomainName 3");
    const tx = await ownedRegistry.setResolver(
      domain.node,
      this.testPublicResolverL1!.address
    );
    console.log("registerDomainName 4");

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
