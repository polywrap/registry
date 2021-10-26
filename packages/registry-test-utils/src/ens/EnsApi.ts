import { EnsDomain } from "@polywrap/registry-js";
import { ethers, Signer } from "ethers";
import { POLYWRAP_OWNER_RECORD_NAME } from "../constants";
import { EnsTestContracts } from "./EnsTestContracts";

export class EnsApi {
  private ensTestContracts: EnsTestContracts;

  constructor(ensTestContracts: EnsTestContracts) {
    this.ensTestContracts = ensTestContracts;
  }

  async registerDomainName(
    domainOwner: Signer,
    domain: EnsDomain
  ): Promise<void> {
    this.ensTestContracts.connect(domainOwner);

    await this.ensTestContracts.testEthRegistrarL1.register(
      domain.labelHash,
      await domainOwner.getAddress(),
      10 * 60
    );

    const tx = await this.ensTestContracts.ensRegistryL1.setResolver(
      domain.node,
      this.ensTestContracts.testPublicResolverL1.address
    );

    await tx.wait();
  }

  async setPolywrapOwner(
    domainOwner: Signer,
    domain: EnsDomain
  ): Promise<void> {
    this.ensTestContracts.connect(domainOwner);

    const tx = await this.ensTestContracts.testPublicResolverL1.setText(
      domain.node,
      POLYWRAP_OWNER_RECORD_NAME,
      await domainOwner.getAddress()
    );

    await tx.wait();
  }

  async getPolywrapOwner(domain: EnsDomain): Promise<string> {
    return await this.ensTestContracts.testPublicResolverL1.text(
      domain.node,
      POLYWRAP_OWNER_RECORD_NAME
    );
  }
}
