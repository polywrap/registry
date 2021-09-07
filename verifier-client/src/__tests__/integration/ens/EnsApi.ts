import { EnsDomain } from "./EnsDomain";
import { Contract, ethers, Signer } from "ethers";
import * as EnsRegistryL1 from "../../../deployments/localhost/EnsRegistryL1.json"
import * as TestEthRegistrarL1 from "../../../deployments/localhost/TestEthRegistrarL1.json"
import * as TestPublicResolverL1 from "../../../deployments/localhost/TestPublicResolverL1.json"
import { POLYWRAP_OWNER_RECORD_NAME } from "../constants";
import { ENSRegistry, TestEthRegistrar, TestPublicResolver, ENSRegistry__factory, TestEthRegistrar__factory, TestPublicResolver__factory } from "../../../typechain";

const rootNode = ethers.utils.zeroPad([0], 32);

export class EnsApi {
  ensRegistry: ENSRegistry | undefined;
  ethRegistrar: TestEthRegistrar | undefined;
  ensPublicResolver: TestPublicResolver | undefined;

  async init(provider: ethers.providers.Provider): Promise<void> {
    const signer = new ethers.Wallet(process.env.REGISTRY_AUTHORITY_PRIVATE_KEY!, provider);

    this.ensRegistry = ENSRegistry__factory.connect(EnsRegistryL1.address, signer);
    this.ethRegistrar = TestEthRegistrar__factory.connect(TestEthRegistrarL1.address, signer);
    this.ensPublicResolver = TestPublicResolver__factory.connect(TestPublicResolverL1.address, signer);
  }

  async registerDomainName(domainOwner: Signer, domain: EnsDomain): Promise<void> {
    await this.ethRegistrar!.register(domain.labelHash, await domainOwner.getAddress(), 10 * 60);
    const ownedRegistry = this.ensRegistry!.connect(domainOwner);

    const tx = await ownedRegistry.setResolver(domain.node, this.ensPublicResolver!.address);

    await tx.wait();
  }

  async setPolywrapOwner(domainOwner: Signer, domain: EnsDomain): Promise<void> {

    const ownedPublicResolver = this.ensPublicResolver!.connect(domainOwner);

    const tx = await ownedPublicResolver.setText(domain.node, POLYWRAP_OWNER_RECORD_NAME, await domainOwner.getAddress());

    await tx.wait();
  }

  async getPolywrapOwner(domain: EnsDomain): Promise<string> {
    return await this.ensPublicResolver!.text(domain.node, POLYWRAP_OWNER_RECORD_NAME);
  }
}