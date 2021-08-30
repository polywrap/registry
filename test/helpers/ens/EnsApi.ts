import { ethers } from "hardhat";
import { TestENSRegistry, TestEthRegistrar, TestPublicResolver } from "../../../typechain";
import { labelhash } from "../labelhash";
import { POLYWRAP_OWNER_RECORD_NAME } from "../constants";
import { EnsDomain } from "./EnsDomain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signers";
import { Contract } from "ethers";

const rootNode = ethers.utils.zeroPad([0], 32);

export class EnsApi {
  ensRegistry: Contract | undefined;
  ethRegistrar: Contract | undefined;
  ensPublicResolver: Contract | undefined;

  async loadContracts(): Promise<void> {
    this.ensRegistry = await ethers.getContract('EnsRegistryL1');
    this.ethRegistrar = await ethers.getContract('TestEthRegistrarL1');
    this.ensPublicResolver = await ethers.getContract('TestPublicResolverL1');
  }

  async registerDomainName(domainOwner: SignerWithAddress, domain: EnsDomain): Promise<void> {
    await this.ethRegistrar!.register(domain.labelHash, domainOwner.address, 10 * 60);
    const ownedRegistry = this.ensRegistry!.connect(domainOwner);

    await ownedRegistry.setResolver(domain.node, this.ensPublicResolver!.address);
  }

  async setPolywrapOwner(domainOwner: SignerWithAddress, domain: EnsDomain, ownerAddress: string): Promise<void> {

    const ownedPublicResolver = this.ensPublicResolver!.connect(domainOwner);

    const tx = await ownedPublicResolver.setText(domain.node, POLYWRAP_OWNER_RECORD_NAME, ownerAddress);
    await tx.wait();
  }

  async getPolywrapOwner(domain: EnsDomain): Promise<string> {
    return await this.ensPublicResolver!.text(domain.node, POLYWRAP_OWNER_RECORD_NAME);
  }
}