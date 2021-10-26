import { ethers, Signer } from "ethers";
import { ensContractAddressesTestnet } from "../constants";
import {
  ENSRegistry,
  ENSRegistry__factory,
  TestEthRegistrar,
  TestEthRegistrar__factory,
  TestPublicResolver,
  TestPublicResolver__factory,
} from "../typechain";

export class EnsTestContracts {
  ensRegistryL1: ENSRegistry;
  testEthRegistrarL1: TestEthRegistrar;
  testPublicResolverL1: TestPublicResolver;

  constructor(contracts: {
    ensRegistryL1: ENSRegistry;
    testEthRegistrarL1: TestEthRegistrar;
    testPublicResolverL1: TestPublicResolver;
  }) {
    this.ensRegistryL1 = contracts.ensRegistryL1;
    this.testEthRegistrarL1 = contracts.testEthRegistrarL1;
    this.testPublicResolverL1 = contracts.testPublicResolverL1;
  }

  connect(signer: Signer): void {
    this.ensRegistryL1 = this.ensRegistryL1.connect(signer);
    this.testEthRegistrarL1 = this.testEthRegistrarL1.connect(signer);
    this.testPublicResolverL1 = this.testPublicResolverL1.connect(signer);
  }

  static fromAddresses(
    addresses: {
      ensRegistryL1: string;
      testEthRegistrarL1: string;
      testPublicResolverL1: string;
    },
    provider: ethers.providers.Provider
  ): EnsTestContracts {
    return new EnsTestContracts({
      ensRegistryL1: ENSRegistry__factory.connect(
        addresses.ensRegistryL1,
        provider
      ),
      testEthRegistrarL1: TestEthRegistrar__factory.connect(
        addresses.testEthRegistrarL1,
        provider
      ),
      testPublicResolverL1: TestPublicResolver__factory.connect(
        addresses.testPublicResolverL1,
        provider
      ),
    });
  }

  static fromTestnet(provider: ethers.providers.Provider): EnsTestContracts {
    return EnsTestContracts.fromAddresses(
      ensContractAddressesTestnet,
      provider
    );
  }
}
