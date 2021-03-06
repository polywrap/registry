import { expect } from "chai";
import { ethers } from "hardhat";
import { deployments } from "hardhat";
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
import { Signer } from "ethers";
import { EnsApiV1 } from "@polywrap/registry-test-utils";
import { JsonRpcProvider } from "@ethersproject/providers";
import { PolywrapRegistry } from "../../helpers/PolywrapRegistry";
import { RegistryContractAddresses } from "../../helpers/RegistryContractAddresses";

describe("Organizations", () => {
  let ens: EnsApiV1;

  let owner: Signer;
  let domainOwner: Signer;
  let organizationOwner: Signer;
  let organizationOwner2: Signer;
  let organizationController: Signer;
  let organizationController2: Signer;
  let randomAcc: Signer;

  let registry: PolywrapRegistry;
  let registryContractAddresses: RegistryContractAddresses;

  const testDomain = "test-domain.eth";
  const domainRegistry = "ens";

  const connectRegistry = async (signer: Signer): Promise<PolywrapRegistry> => {
    return registry.connect(
      signer.provider as JsonRpcProvider,
      await signer.getAddress(),
      registryContractAddresses
    );
  };

  before(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0];
    domainOwner = signers[1];
    organizationOwner = signers[2];
    organizationOwner2 = signers[3];
    organizationController = signers[4];
    organizationController2 = signers[5];
    randomAcc = signers[6];

    registry = new PolywrapRegistry();
  });

  beforeEach(async () => {
    const deploys = await deployments.fixture(["ens", "v1"]);
    registryContractAddresses = {
      polywrapRegistry: deploys["PolywrapRegistryV1"].address,
    };

    ens = new EnsApiV1(
      {
        ensRegistryL1: deploys["EnsRegistryL1"].address,
        testEthRegistrarL1: deploys["TestEthRegistrarL1"].address,
        testPublicResolverL1: deploys["TestPublicResolverL1"].address,
      },
      ethers.getDefaultProvider()
    );

    registry = await connectRegistry(domainOwner);
  });

  it("can claim organization ownership", async () => {
    const organizationOwnerAddress = await organizationOwner.getAddress();

    const organizationId = await registry.calculateOrganizationId(
      domainRegistry,
      testDomain
    );

    await ens.registerDomainName(owner, domainOwner, testDomain);

    registry = await connectRegistry(domainOwner);

    expect(await registry.organizationExists(organizationId)).to.equal(false);

    const [error, tx] = await registry.claimOrganizationOwnership(
      domainRegistry,
      testDomain,
      organizationOwnerAddress
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    const organization = await registry.organization(organizationId);

    expect(organization.exists).to.be.true;
    expect(organization.owner).to.equal(organizationOwnerAddress);
    expect(organization.controller).to.equal(ethers.constants.AddressZero);

    expect(await registry.organizationExists(organizationId)).to.equal(true);

    expect(await registry.organizationOwner(organizationId)).to.equal(
      organizationOwnerAddress
    );

    expect(await registry.organizationController(organizationId)).to.equal(
      ethers.constants.AddressZero
    );
  });

  it("can claim organization ownership multiple times", async () => {
    const organizationOwnerAddress1 = await organizationOwner.getAddress();
    const organizationOwnerAddress2 = await randomAcc.getAddress();

    const organizationId = await registry.calculateOrganizationId(
      domainRegistry,
      testDomain
    );

    await ens.registerDomainName(owner, domainOwner, testDomain);

    registry = await connectRegistry(domainOwner);

    let [error, tx] = await registry.claimOrganizationOwnership(
      domainRegistry,
      testDomain,
      organizationOwnerAddress1
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    expect(await registry.organizationOwner(organizationId)).to.equal(
      organizationOwnerAddress1
    );

    [error, tx] = await registry.claimOrganizationOwnership(
      domainRegistry,
      testDomain,
      organizationOwnerAddress2
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    expect(await registry.organizationOwner(organizationId)).to.equal(
      organizationOwnerAddress2
    );
  });

  it("forbids non domain owners to claim organization ownership", async () => {
    const organizationOwnerAddress = await organizationOwner.getAddress();

    const organizationId = await registry.calculateOrganizationId(
      domainRegistry,
      testDomain
    );

    await ens.registerDomainName(owner, domainOwner, testDomain);

    registry = await connectRegistry(randomAcc);

    const [error, tx] = await registry.claimOrganizationOwnership(
      domainRegistry,
      testDomain,
      organizationOwnerAddress
    );

    expect(tx).to.be.undefined;
    expect(error).to.not.be.undefined;
  });

  it("can transfer organization ownership", async () => {
    const organizationOwnerAddress1 = await organizationOwner.getAddress();
    const organizationOwnerAddress2 = await organizationOwner2.getAddress();

    const organizationId = await registry.calculateOrganizationId(
      domainRegistry,
      testDomain
    );

    await ens.registerDomainName(owner, domainOwner, testDomain);

    registry = await connectRegistry(domainOwner);

    let [error, tx] = await registry.claimOrganizationOwnership(
      domainRegistry,
      testDomain,
      organizationOwnerAddress1
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    expect(await registry.organizationOwner(organizationId)).to.equal(
      organizationOwnerAddress1
    );

    registry = await connectRegistry(organizationOwner);

    [error, tx] = await registry.transferOrganizationOwnership(
      organizationId,
      organizationOwnerAddress2
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    expect(await registry.organizationOwner(organizationId)).to.equal(
      organizationOwnerAddress2
    );
  });

  it("forbids non owner to transfer organization ownership", async () => {
    const organizationOwnerAddress1 = await organizationOwner.getAddress();
    const organizationOwnerAddress2 = await organizationOwner2.getAddress();

    const organizationId = await registry.calculateOrganizationId(
      domainRegistry,
      testDomain
    );

    await ens.registerDomainName(owner, domainOwner, testDomain);

    registry = await connectRegistry(domainOwner);

    let [error, tx] = await registry.claimOrganizationOwnership(
      domainRegistry,
      testDomain,
      organizationOwnerAddress1
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    expect(await registry.organizationOwner(organizationId)).to.equal(
      organizationOwnerAddress1
    );

    registry = await connectRegistry(randomAcc);

    [error, tx] = await registry.transferOrganizationOwnership(
      organizationId,
      organizationOwnerAddress2
    );

    expect(tx).to.be.undefined;
    expect(error).to.not.be.undefined;
  });

  it("allows organization owner to set organization controller", async () => {
    const organizationOwnerAddress = await organizationOwner.getAddress();
    const organizationControllerAddress = await organizationController.getAddress();

    const organizationId = await registry.calculateOrganizationId(
      domainRegistry,
      testDomain
    );

    await ens.registerDomainName(owner, domainOwner, testDomain);

    registry = await connectRegistry(domainOwner);

    let [error, tx] = await registry.claimOrganizationOwnership(
      domainRegistry,
      testDomain,
      organizationOwnerAddress
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    registry = await connectRegistry(organizationOwner);

    [error, tx] = await registry.setOrganizationController(
      organizationId,
      organizationControllerAddress
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    const organization = await registry.organization(organizationId);
    expect(organization.exists).to.be.true;
    expect(organization.owner).to.equal(organizationOwnerAddress);
    expect(organization.controller).to.equal(organizationControllerAddress);

    expect(await registry.organizationController(organizationId)).to.equal(
      organizationControllerAddress
    );
  });

  it("allows organization controller to transfer organization control", async () => {
    const organizationOwnerAddress = await organizationOwner.getAddress();
    const organizationControllerAddress = await organizationController.getAddress();
    const organizationControllerAddress2 = await organizationController2.getAddress();

    const organizationId = await registry.calculateOrganizationId(
      domainRegistry,
      testDomain
    );

    await ens.registerDomainName(owner, domainOwner, testDomain);

    registry = await connectRegistry(domainOwner);

    let [error, tx] = await registry.claimOrganizationOwnership(
      domainRegistry,
      testDomain,
      organizationOwnerAddress
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    registry = await connectRegistry(organizationOwner);

    [error, tx] = await registry.setOrganizationController(
      organizationId,
      organizationControllerAddress
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    registry = await connectRegistry(organizationController);

    [error, tx] = await registry.transferOrganizationControl(
      organizationId,
      organizationControllerAddress2
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    const organization = await registry.organization(organizationId);
    expect(organization.exists).to.be.true;
    expect(organization.owner).to.equal(organizationOwnerAddress);
    expect(organization.controller).to.equal(organizationControllerAddress2);

    expect(await registry.organizationController(organizationId)).to.equal(
      organizationControllerAddress2
    );
  });

  it("forbids non organization owner from setting organization owner", async () => {
    const organizationOwnerAddress1 = await organizationOwner.getAddress();
    const organizationControllerAddress2 = await organizationController2.getAddress();

    const organizationId = await registry.calculateOrganizationId(
      domainRegistry,
      testDomain
    );

    await ens.registerDomainName(owner, domainOwner, testDomain);

    registry = await connectRegistry(domainOwner);

    let [error, tx] = await registry.claimOrganizationOwnership(
      domainRegistry,
      testDomain,
      organizationOwnerAddress1
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    expect(await registry.organizationOwner(organizationId)).to.equal(
      organizationOwnerAddress1
    );

    registry = await connectRegistry(organizationOwner);

    [error, tx] = await registry.transferOrganizationControl(
      organizationId,
      organizationControllerAddress2
    );

    expect(tx).to.be.undefined;
    expect(error).to.not.be.undefined;

    registry = await connectRegistry(randomAcc);

    [error, tx] = await registry.transferOrganizationControl(
      organizationId,
      organizationControllerAddress2
    );

    expect(tx).to.be.undefined;
    expect(error).to.not.be.undefined;
  });
});
