import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { TestENSRegistry, TestEthRegistrar, TestPublicResolver } from "../../../typechain";
import { labelhash } from "../labelhash";
import { polywrapControllerRecordName } from "../polywrapControllerRecordName";
import { EnsDomain } from "./EnsDomain";

const rootNode = ethers.utils.zeroPad([0], 32);

export class EnsApi {
  ensRegistry: TestENSRegistry | undefined;
  ethRegistrar: TestEthRegistrar | undefined;
  ensPublicResolver: TestPublicResolver | undefined;

  //ethController can set resolvers
  async deploy(ethController: SignerWithAddress): Promise<void> {

    const ensRegistryFactory = await ethers.getContractFactory("TestENSRegistry");

    this.ensRegistry = await ensRegistryFactory.deploy();

    const ethRegistrarFactory = await ethers.getContractFactory("TestEthRegistrar");

    this.ethRegistrar = await ethRegistrarFactory.deploy(this.ensRegistry.address, ethers.utils.namehash(EnsDomain.TLD));

    await this.ensRegistry.setSubnodeOwner(rootNode, labelhash(EnsDomain.TLD), this.ethRegistrar.address);
    await this.ethRegistrar.addController(ethController.address);

    const publicResolverFactory = await ethers.getContractFactory("TestPublicResolver");
    this.ensPublicResolver = await publicResolverFactory.deploy(this.ensRegistry.address);

    this.ethRegistrar = this.ethRegistrar.connect(ethController);

    await this.ethRegistrar.setResolver(this.ensPublicResolver.address);
  }

  async registerDomainName(domainOwner: SignerWithAddress, domain: EnsDomain): Promise<void> {
    await this.ethRegistrar!.register(domain.labelHash, domainOwner.address, 10 * 60);
    const ownedRegistry = this.ensRegistry!.connect(domainOwner);

    await ownedRegistry.setResolver(domain.node, this.ensPublicResolver!.address);
  }

  async setPolywrapController(domainOwner: SignerWithAddress, domain: EnsDomain, controllerAddress: string): Promise<void> {

    const ownedPublicResolver = this.ensPublicResolver!.connect(domainOwner);

    const tx = await ownedPublicResolver.setText(domain.node, polywrapControllerRecordName, controllerAddress);
    await tx.wait();
  }

  async getPolywrapController(domain: EnsDomain): Promise<string> {
    return await this.ensPublicResolver!.text(domain.node, polywrapControllerRecordName);
  }
}