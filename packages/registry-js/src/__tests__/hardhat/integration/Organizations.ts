import { expect } from "chai";
import { ethers } from "hardhat";
import { EnsApi } from "./helpers/EnsApi";
import { deployments } from "hardhat";
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
import { Signer } from "ethers";
import { EnsDomain } from "./helpers/EnsDomain";
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
    const deploys = await deployments.fixture(["ens"]);
    registryContractAddresses = {
      polywrapRegistry: deploys["PolyWrapRegistryV1"].address,
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
      testDomain.node,
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

    registry = connectRegistry(randomAcc);

    let tx = await registry.claimOrganizationOwnership(
      testDomain.registry,
      testDomain.node,
      organizationOwnerAddress1
    );

    expect(
      await registry.organizationOwner(testDomain.organizationId)
    ).to.equal(organizationOwnerAddress1);

    tx = await registry.claimOrganizationOwnership(
      testDomain.registry,
      testDomain.node,
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
      testDomain.node,
      organizationOwnerAddress
    );

    await expect(promise).to.revertedWith(
      "reverted with custom error 'OnlyDomainRegistryOwner()'"
    );
  });

  it("can transfer organization ownership", async () => {
    const organizationOwnerAddress1 = await organizationOwner.getAddress();
    const organizationOwnerAddress2 = await organizationOwner2.getAddress();

    const testDomain = new EnsDomain("test-domain");

    await ens.registerDomainName(owner, domainOwner, testDomain);

    registry = connectRegistry(randomAcc);

    let tx = await registry.claimOrganizationOwnership(
      testDomain.registry,
      testDomain.node,
      organizationOwnerAddress1
    );

    expect(
      await registry.organizationOwner(testDomain.organizationId)
    ).to.equal(organizationOwnerAddress1);

    registry = connectRegistry(randomAcc);

    tx = await registry.setOrganizationOwner(
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

    registry = connectRegistry(randomAcc);

    const tx = await registry.claimOrganizationOwnership(
      testDomain.registry,
      testDomain.node,
      organizationOwnerAddress1
    );

    await tx.wait();

    expect(
      await registry.organizationOwner(testDomain.organizationId)
    ).to.equal(organizationOwnerAddress1);

    registry = connectRegistry(randomAcc);

    const promise = registry.setOrganizationOwner(
      testDomain.organizationId,
      organizationOwnerAddress2
    );

    await expect(promise).to.revertedWith(
      "reverted with custom error 'OnlyOrganizationOwner()'"
    );
  });

  it("allows organization owner to set organization controller", async () => {
    const organizationOwnerAddress = await organizationOwner.getAddress();
    const organizationControllerAddress = await organizationController.getAddress();

    const testDomain = new EnsDomain("test-domain");

    await ens.registerDomainName(owner, domainOwner, testDomain);

    registry = connectRegistry(randomAcc);

    let tx = await registry.claimOrganizationOwnership(
      testDomain.registry,
      testDomain.node,
      organizationOwnerAddress
    );

    registry = connectRegistry(randomAcc);

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

  it("allows organization controller to set organization controller", async () => {
    const organizationOwnerAddress = await organizationOwner.getAddress();
    const organizationControllerAddress = await organizationController.getAddress();
    const organizationControllerAddress2 = await organizationController2.getAddress();

    const testDomain = new EnsDomain("test-domain");

    await ens.registerDomainName(owner, domainOwner, testDomain);

    registry = connectRegistry(randomAcc);

    let tx = await registry.claimOrganizationOwnership(
      testDomain.registry,
      testDomain.node,
      organizationOwnerAddress
    );

    tx = await registry.setOrganizationController(
      testDomain.organizationId,
      organizationControllerAddress
    );

    await tx.wait();

    registry = connectRegistry(randomAcc);

    tx = await registry.setOrganizationController(
      testDomain.organizationId,
      organizationControllerAddress2
    );

    const organization = await registry.organization(testDomain.organizationId);
    expect(organization.exists).to.be.true;
    expect(organization.owner).to.equal(organizationOwnerAddress);
    expect(organization.controller).to.equal(organizationControllerAddress2);

    expect(
      await registry.organizationController(testDomain.organizationId)
    ).to.equal(organizationControllerAddress2);
  });

  it("allows organization owner to set organization owner and controller in a single transaction", async () => {
    const organizationOwnerAddress = await organizationOwner.getAddress();
    const organizationOwnerAddress2 = await organizationOwner2.getAddress();
    const organizationControllerAddress = await organizationController.getAddress();

    const testDomain = new EnsDomain("test-domain");

    await ens.registerDomainName(owner, domainOwner, testDomain);

    registry = connectRegistry(randomAcc);

    let tx = await registry.claimOrganizationOwnership(
      testDomain.registry,
      testDomain.node,
      organizationOwnerAddress
    );

    registry = connectRegistry(randomAcc);

    tx = await registry.setOrganizationOwnerAndController(
      testDomain.organizationId,
      organizationOwnerAddress2,
      organizationControllerAddress
    );

    await tx.wait();

    const organization = await registry.organization(testDomain.organizationId);
    expect(organization.exists).to.be.true;
    expect(organization.owner).to.equal(organizationOwnerAddress2);
    expect(organization.controller).to.equal(organizationControllerAddress);

    expect(
      await registry.organizationOwner(testDomain.organizationId)
    ).to.equal(organizationOwnerAddress2);

    expect(
      await registry.organizationController(testDomain.organizationId)
    ).to.equal(organizationControllerAddress);
  });

  it("forbids organization controller transfer organization ownership", async () => {
    const organizationOwnerAddress1 = await organizationOwner.getAddress();
    const organizationOwnerAddress2 = await organizationOwner2.getAddress();

    const testDomain = new EnsDomain("test-domain");

    await ens.registerDomainName(owner, domainOwner, testDomain);

    registry = connectRegistry(randomAcc);

    const tx = await registry.claimOrganizationOwnership(
      testDomain.registry,
      testDomain.node,
      organizationOwnerAddress1
    );

    await tx.wait();

    expect(
      await registry.organizationOwner(testDomain.organizationId)
    ).to.equal(organizationOwnerAddress1);

    registry = connectRegistry(randomAcc);

    const promise = registry.setOrganizationOwner(
      testDomain.organizationId,
      organizationOwnerAddress2
    );

    await expect(promise).to.revertedWith(
      "reverted with custom error 'OnlyOrganizationOwner()'"
    );
  });
});
