import { Provider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { POLYWRAP_OWNER_RECORD_NAME } from "../constants";
import { EnsDomain } from "registry-js";
import { Contract, Signer } from "ethers";

import * as EnsRegistryL1 from "../deployments/localhost/EnsRegistryL1.json";
import * as TestEthRegistrarL1 from "../deployments/localhost/TestEthRegistrarL1.json";
import * as TestPublicResolverL1 from "../deployments/localhost/TestPublicResolverL1.json";
import {
  ENSRegistry__factory,
  TestEthRegistrar__factory,
  TestPublicResolver__factory,
} from "../typechain";

const rootNode = ethers.utils.zeroPad([0], 32);

export class EnsApi {
  ensRegistry: Contract | undefined;
  ethRegistrar: Contract | undefined;
  ensPublicResolver: Contract | undefined;

  async init(signer: Signer): Promise<void> {
    this.ensRegistry = ENSRegistry__factory.connect(
      EnsRegistryL1.address,
      signer
    );
    this.ethRegistrar = TestEthRegistrar__factory.connect(
      TestEthRegistrarL1.address,
      signer
    );
    this.ensPublicResolver = TestPublicResolver__factory.connect(
      TestPublicResolverL1.address,
      signer
    );
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

    await this.ensRegistry!.setResolver(
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
