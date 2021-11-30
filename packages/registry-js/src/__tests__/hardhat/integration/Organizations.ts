import { expect } from "chai";
import { ethers } from "hardhat";
import { EnsApi } from "./helpers/EnsApi";
import { deployments } from "hardhat";
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
import { Signer } from "ethers";
import { EnsDomain } from "../../../v1/types/EnsDomain";
import { PolywrapRegistry, RegistryContractAddresses } from "../../../v1";

describe("Organizations", () => {
  let ens: EnsApi;
  let registry: PolywrapRegistry;

  let owner: Signer;
  let domainOwner: Signer;
  let organizationOwner: Signer;
  let organizationOwner2: Signer;
  let organizationController: Signer;
  let organizationController2: Signer;
  let randomAcc: Signer;

  let registryContractAddresses: RegistryContractAddresses;

  const connectRegistry = (signer: Signer): PolywrapRegistry => {
    return new PolywrapRegistry(signer, registryContractAddresses);
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
  });

  beforeEach(async () => {
    const deploys = await deployments.fixture(["ens", "v1"]);
    registryContractAddresses = {
      polywrapRegistry: deploys["PolywrapRegistryV1"].address,
    };

    const provider = ethers.getDefaultProvider();

    ens = new EnsApi(
      {
        ensRegistryL1: deploys["EnsRegistryL1"].address,
        testEthRegistrarL1: deploys["TestEthRegistrarL1"].address,
        testPublicResolverL1: deploys["TestPublicResolverL1"].address,
      },
      provider
    );
  });

  it("can claim organization ownership", async () => {
    const organizationOwnerAddress = await organizationOwner.getAddress();

    const testDomain = new EnsDomain("test-domain");

    await ens.registerDomainName(owner, domainOwner, testDomain);

    registry = connectRegistry(domainOwner);

    expect(
      await registry.organizationExists(testDomain.organizationId)
    ).to.equal(false);

    const tx = await registry.claimOrganizationOwnership(
      testDomain.registry,
      testDomain.name,
      organizationOwnerAddress
    );

    await tx.wait();

    const organization = await registry.organization(testDomain.organizationId);
    expect(organization.exists).to.be.true;
    expect(organization.owner).to.equal(organizationOwnerAddress);
    expect(organization.controller).to.equal(ethers.constants.AddressZero);

    expect(
      await registry.organizationExists(testDomain.organizationId)
    ).to.equal(true);

    expect(
      await registry.organizationOwner(testDomain.organizationId)
    ).to.equal(organizationOwnerAddress);

    expect(
      await registry.organizationController(testDomain.organizationId)
    ).to.equal(ethers.constants.AddressZero);

    expect(await registry.organizationIds(0, 10)).to.deep.equal([
      testDomain.organizationId,
    ]);

    expect(await registry.organizationCount()).to.equal(1);
  });

  it("can claim organization ownership multiple times", async () => {
    const organizationOwnerAddress1 = await organizationOwner.getAddress();
    const organizationOwnerAddress2 = await randomAcc.getAddress();

    const testDomain = new EnsDomain("test-domain");

    await ens.registerDomainName(owner, domainOwner, testDomain);

    registry = connectRegistry(domainOwner);

    let tx = await registry.claimOrganizationOwnership(
      testDomain.registry,
      testDomain.name,
      organizationOwnerAddress1
    );

    await tx.wait();

    expect(
      await registry.organizationOwner(testDomain.organizationId)
    ).to.equal(organizationOwnerAddress1);

    tx = await registry.claimOrganizationOwnership(
      testDomain.registry,
      testDomain.name,
      organizationOwnerAddress2
    );

    await tx.wait();

    expect(
      await registry.organizationOwner(testDomain.organizationId)
    ).to.equal(organizationOwnerAddress2);
  });

  it("forbids non domain owners to claim organization ownership", async () => {
    const organizationOwnerAddress = await organizationOwner.getAddress();

    const testDomain = new EnsDomain("test-domain");

    await ens.registerDomainName(owner, domainOwner, testDomain);

    registry = connectRegistry(randomAcc);

    const promise = registry.claimOrganizationOwnership(
      testDomain.registry,
      testDomain.name,
      organizationOwnerAddress
    );

    await expect(promise).to.be.reverted;
  });

  it("can transfer organization ownership", async () => {
    const organizationOwnerAddress1 = await organizationOwner.getAddress();
    const organizationOwnerAddress2 = await organizationOwner2.getAddress();

    const testDomain = new EnsDomain("test-domain");

    await ens.registerDomainName(owner, domainOwner, testDomain);

    registry = connectRegistry(domainOwner);

    let tx = await registry.claimOrganizationOwnership(
      testDomain.registry,
      testDomain.name,
      organizationOwnerAddress1
    );

    await tx.wait();

    expect(
      await registry.organizationOwner(testDomain.organizationId)
    ).to.equal(organizationOwnerAddress1);

    registry = connectRegistry(organizationOwner);

    tx = await registry.transferOrganizationOwnership(
      testDomain.organizationId,
      organizationOwnerAddress2
    );

    await tx.wait();

    expect(
      await registry.organizationOwner(testDomain.organizationId)
    ).to.equal(organizationOwnerAddress2);
  });

  it("forbids non owner to transfer organization ownership", async () => {
    const organizationOwnerAddress1 = await organizationOwner.getAddress();
    const organizationOwnerAddress2 = await organizationOwner2.getAddress();

    const testDomain = new EnsDomain("test-domain");

    await ens.registerDomainName(owner, domainOwner, testDomain);

    registry = connectRegistry(domainOwner);

    const tx = await registry.claimOrganizationOwnership(
      testDomain.registry,
      testDomain.name,
      organizationOwnerAddress1
    );

    await tx.wait();

    expect(
      await registry.organizationOwner(testDomain.organizationId)
    ).to.equal(organizationOwnerAddress1);

    registry = connectRegistry(randomAcc);

    const promise = registry.transferOrganizationOwnership(
      testDomain.organizationId,
      organizationOwnerAddress2
    );

    await expect(promise).to.reverted;
  });

  it("allows organization owner to set organization controller", async () => {
    const organizationOwnerAddress = await organizationOwner.getAddress();
    const organizationControllerAddress = await organizationController.getAddress();

    const testDomain = new EnsDomain("test-domain");

    await ens.registerDomainName(owner, domainOwner, testDomain);

    registry = connectRegistry(domainOwner);

    let tx = await registry.claimOrganizationOwnership(
      testDomain.registry,
      testDomain.name,
      organizationOwnerAddress
    );

    await tx.wait();

    registry = connectRegistry(organizationOwner);

    tx = await registry.setOrganizationController(
      testDomain.organizationId,
      organizationControllerAddress
    );

    await tx.wait();

    const organization = await registry.organization(testDomain.organizationId);
    expect(organization.exists).to.be.true;
    expect(organization.owner).to.equal(organizationOwnerAddress);
    expect(organization.controller).to.equal(organizationControllerAddress);

    expect(
      await registry.organizationController(testDomain.organizationId)
    ).to.equal(organizationControllerAddress);
  });

  it("allows organization controller to transfer organization control", async () => {
    const organizationOwnerAddress = await organizationOwner.getAddress();
    const organizationControllerAddress = await organizationController.getAddress();
    const organizationControllerAddress2 = await organizationController2.getAddress();

    const testDomain = new EnsDomain("test-domain");

    await ens.registerDomainName(owner, domainOwner, testDomain);

    registry = connectRegistry(domainOwner);

    let tx = await registry.claimOrganizationOwnership(
      testDomain.registry,
      testDomain.name,
      organizationOwnerAddress
    );

    await tx.wait();

    registry = connectRegistry(organizationOwner);

    tx = await registry.setOrganizationController(
      testDomain.organizationId,
      organizationControllerAddress
    );

    await tx.wait();

    registry = connectRegistry(organizationController);

    tx = await registry.transferOrganizationControl(
      testDomain.organizationId,
      organizationControllerAddress2
    );

    await tx.wait();

    const organization = await registry.organization(testDomain.organizationId);
    expect(organization.exists).to.be.true;
    expect(organization.owner).to.equal(organizationOwnerAddress);
    expect(organization.controller).to.equal(organizationControllerAddress2);

    expect(
      await registry.organizationController(testDomain.organizationId)
    ).to.equal(organizationControllerAddress2);
  });

  it("forbids non organization owner from setting organization owner", async () => {
    const organizationOwnerAddress1 = await organizationOwner.getAddress();
    const organizationControllerAddress2 = await organizationController2.getAddress();

    const testDomain = new EnsDomain("test-domain");

    await ens.registerDomainName(owner, domainOwner, testDomain);

    registry = connectRegistry(domainOwner);

    const tx = await registry.claimOrganizationOwnership(
      testDomain.registry,
      testDomain.name,
      organizationOwnerAddress1
    );

    await tx.wait();

    expect(
      await registry.organizationOwner(testDomain.organizationId)
    ).to.equal(organizationOwnerAddress1);

    registry = connectRegistry(organizationOwner);

    let promise = registry.transferOrganizationControl(
      testDomain.organizationId,
      organizationControllerAddress2
    );

    await expect(promise).to.reverted;

    registry = connectRegistry(randomAcc);

    promise = registry.transferOrganizationControl(
      testDomain.organizationId,
      organizationControllerAddress2
    );

    await expect(promise).to.reverted;
  });
});