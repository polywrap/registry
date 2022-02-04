import { expect } from "chai";
import { ethers } from "hardhat";
import { deployments } from "hardhat";
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
import { Signer } from "ethers";
import { EnsDomainV1 } from "@polywrap/registry-core-js";
import { EnsApiV1 } from "@polywrap/registry-test-utils";
import { PolywrapRegistry } from "../../helpers/PolywrapRegistry";
import { JsonRpcProvider } from "@ethersproject/providers";
import { RegistryContractAddresses } from "../../helpers/RegistryContractAddresses";
import { Deployment } from "hardhat-deploy/dist/types";

describe("ENS", () => {
  let owner: Signer;
  let domainOwner: Signer;

  let registry: PolywrapRegistry;
  let registryContractAddresses: RegistryContractAddresses;
  let deploys: { [name: string]: Deployment };

  const connectRegistry = async (signer: Signer): Promise<PolywrapRegistry> => {
    return registry.connect(
      signer.provider as JsonRpcProvider,
      await signer.getAddress(),
      registryContractAddresses
    );
  };

  before(async () => {
    registry = new PolywrapRegistry();
  });

  beforeEach(async () => {
    deploys = await deployments.fixture(["ens", "v1"]);
    registryContractAddresses = {
      polywrapRegistry: deploys["PolywrapRegistryV1"].address,
    };
  });

  it("register ens domain", async () => {
    const signers = await ethers.getSigners();

    owner = signers[0];
    domainOwner = signers[1];
    const provider = ethers.getDefaultProvider();

    const ens = new EnsApiV1(
      {
        ensRegistryL1: deploys["EnsRegistryL1"].address,
        testEthRegistrarL1: deploys["TestEthRegistrarL1"].address,
        testPublicResolverL1: deploys["TestPublicResolverL1"].address,
      },
      provider
    );

    const testDomain = new EnsDomainV1("test-domain");

    await ens.registerDomainName(owner, domainOwner, testDomain);

    ens.connect(domainOwner);

    expect(await ens.owner(testDomain)).to.equal(
      await domainOwner.getAddress()
    );

    registry = await connectRegistry(owner);

    expect(
      await registry.domainOwner(testDomain.registry, testDomain.name)
    ).to.equal(await domainOwner.getAddress());
  });
});
