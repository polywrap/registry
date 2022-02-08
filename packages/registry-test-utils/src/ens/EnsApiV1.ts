import { Signer } from "ethers";
import {
  ENSRegistry,
  ENSRegistry__factory,
  TestEthRegistrar,
  TestEthRegistrar__factory,
} from "../typechain";
import { BaseProvider } from "@ethersproject/providers";
import { EnsDomainV1 } from "@polywrap/registry-core-js";

export class EnsApiV1 {
  private ensRegistryL1: ENSRegistry;
  private testEthRegistrarL1: TestEthRegistrar;

  constructor(
    contractAddresses: {
      ensRegistryL1: string;
      testEthRegistrarL1: string;
      testPublicResolverL1: string;
    },
    provider: BaseProvider
  ) {
    this.ensRegistryL1 = ENSRegistry__factory.connect(
      contractAddresses.ensRegistryL1,
      provider
    );
    this.testEthRegistrarL1 = TestEthRegistrar__factory.connect(
      contractAddresses.testEthRegistrarL1,
      provider
    );
  }

  connect(signer: Signer): void {
    this.ensRegistryL1 = this.ensRegistryL1.connect(signer);
    this.testEthRegistrarL1 = this.testEthRegistrarL1.connect(signer);
  }

  async registerDomainName(
    owner: Signer,
    domainOwner: Signer,
    domain: string
  ): Promise<void> {
    const labelHash = new EnsDomainV1(domain).labelHash;

    let tx = await this.testEthRegistrarL1
      .connect(owner)
      .addController(await domainOwner.getAddress());

    await tx.wait();

    tx = await this.testEthRegistrarL1
      .connect(domainOwner)
      .register(labelHash, await domainOwner.getAddress(), 10 * 60);

    await tx.wait();
  }

  async owner(domain: string): Promise<string> {
    const node = new EnsDomainV1(domain).node;

    return this.ensRegistryL1.owner(node);
  }
}
