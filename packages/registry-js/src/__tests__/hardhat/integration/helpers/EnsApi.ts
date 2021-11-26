import { Signer } from "ethers";
import {
  ENSRegistry,
  ENSRegistry__factory,
  TestEthRegistrar,
  TestEthRegistrar__factory,
} from "../../../../typechain";
import { BaseProvider } from "@ethersproject/providers";
import { EnsDomain } from "./EnsDomain";

export class EnsApi {
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

  async registerDomainName(
    owner: Signer,
    domainOwner: Signer,
    domain: EnsDomain
  ): Promise<void> {
    let tx = await this.testEthRegistrarL1
      .connect(owner)
      .addController(await domainOwner.getAddress());

    await tx.wait();

    tx = await this.testEthRegistrarL1
      .connect(domainOwner)
      .register(domain.labelHash, await domainOwner.getAddress(), 10 * 60);

    await tx.wait();
  }
}
