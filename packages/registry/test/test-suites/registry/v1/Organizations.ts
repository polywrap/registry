import hre, { ethers, deployments } from "hardhat";
import chai, { expect } from "chai";
import {
  PolywrapRegistryV1,
  PolywrapRegistryV1__factory,
} from "../../../../typechain-types";
import {
  expectEvent,
} from "../../../helpers";
import { Signer } from "ethers";
import { EnsApi } from "../../../helpers/ens/EnsApi";
import { EnsDomain } from "../../../helpers/EnsDomain";

describe("Organization ownership", () => {
  let registry: PolywrapRegistryV1;

  let ens: EnsApi;

  let owner: Signer;
  let domainOwner: Signer;
  let organizationOwner: Signer;
  let organizationOwner2: Signer;
  let organizationController: Signer;
  let organizationController2: Signer;
  let randomAcc: Signer;

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

    const provider = ethers.getDefaultProvider();

    registry = PolywrapRegistryV1__factory.connect(
      deploys["PolywrapRegistryL1"].address,
      provider
    );

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
    const domainOwnerAddress = await domainOwner.getAddress();
    const organizationOwnerAddress = await organizationOwner.getAddress();

    const testDomain = new EnsDomain("test-domain");

    await ens.registerDomainName(owner, domainOwner, testDomain);

    registry = registry.connect(domainOwner);

    expect(
      await registry.organizationExists(testDomain.organizationId)
    ).to.equal(false);

    const tx = await registry.claimOrganizationOwnership(
      testDomain.registryBytes32,
      testDomain.node,
      organizationOwnerAddress
    );

    await expectEvent(tx, "OrganizationOwnershipClaimed", {
      domainRegistry: testDomain.registryBytes32,
      domainRegistryNode: testDomain.node,
      domainOwner: domainOwnerAddress,
      newOrganizationOwner: organizationOwnerAddress,
    });

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
    const domainOwnerAddress = await domainOwner.getAddress();
    const organizationOwnerAddress1 = await organizationOwner.getAddress();
    const organizationOwnerAddress2 = await randomAcc.getAddress();

    const testDomain = new EnsDomain("test-domain");

    await ens.registerDomainName(owner, domainOwner, testDomain);

    registry = registry.connect(domainOwner);

    let tx = await registry.claimOrganizationOwnership(
      testDomain.registryBytes32,
      testDomain.node,
      organizationOwnerAddress1
    );

    await expectEvent(tx, "OrganizationOwnershipClaimed", {
      domainRegistry: testDomain.registryBytes32,
      domainRegistryNode: testDomain.node,
      domainOwner: domainOwnerAddress,
      newOrganizationOwner: organizationOwnerAddress1,
    });

    expect(
      await registry.organizationOwner(testDomain.organizationId)
    ).to.equal(organizationOwnerAddress1);

    tx = await registry.claimOrganizationOwnership(
      testDomain.registryBytes32,
      testDomain.node,
      organizationOwnerAddress2
    );

    await expectEvent(tx, "OrganizationOwnershipClaimed", {
      domainRegistry: testDomain.registryBytes32,
      domainRegistryNode: testDomain.node,
      domainOwner: domainOwnerAddress,
      newOrganizationOwner: organizationOwnerAddress2,
    });

    expect(
      await registry.organizationOwner(testDomain.organizationId)
    ).to.equal(organizationOwnerAddress2);
  });

  it("forbids non domain owners to claim organization ownership", async () => {
    const organizationOwnerAddress = await organizationOwner.getAddress();

    const testDomain = new EnsDomain("test-domain");

    await ens.registerDomainName(owner, domainOwner, testDomain);

    registry = registry.connect(randomAcc);

    const promise = registry.claimOrganizationOwnership(
      testDomain.registryBytes32,
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

    registry = registry.connect(domainOwner);

    let tx = await registry.claimOrganizationOwnership(
      testDomain.registryBytes32,
      testDomain.node,
      organizationOwnerAddress1
    );

    expect(
      await registry.organizationOwner(testDomain.organizationId)
    ).to.equal(organizationOwnerAddress1);

    registry = registry.connect(organizationOwner);

    tx = await registry.transferOrganizationOwnership(
      testDomain.organizationId,
      organizationOwnerAddress2
    );

    await expectEvent(tx, "OrganizationOwnerChanged", {
      organizationId: testDomain.organizationId,
      previousOwner: organizationOwnerAddress1,
      newOwner: organizationOwnerAddress2,
    });

    expect(
      await registry.organizationOwner(testDomain.organizationId)
    ).to.equal(organizationOwnerAddress2);
  });

  it("forbids non owner to transfer organization ownership", async () => {
    const organizationOwnerAddress1 = await organizationOwner.getAddress();
    const organizationOwnerAddress2 = await organizationOwner2.getAddress();

    const testDomain = new EnsDomain("test-domain");

    await ens.registerDomainName(owner, domainOwner, testDomain);

    registry = registry.connect(domainOwner);

    const tx = await registry.claimOrganizationOwnership(
      testDomain.registryBytes32,
      testDomain.node,
      organizationOwnerAddress1
    );

    await tx.wait();

    expect(
      await registry.organizationOwner(testDomain.organizationId)
    ).to.equal(organizationOwnerAddress1);

    registry = registry.connect(randomAcc);

    const promise = registry.transferOrganizationOwnership(
      testDomain.organizationId,
      organizationOwnerAddress2
    );

    await expect(promise).to.revertedWith(
      "reverted with custom error 'OnlyOrganizationOwner()'"
    );
  });

  it("allows organization owner to set organization controller", async () => {
    const organizationOwnerAddress = await organizationOwner.getAddress();
    const organizationControllerAddress =
      await organizationController.getAddress();

    const testDomain = new EnsDomain("test-domain");

    await ens.registerDomainName(owner, domainOwner, testDomain);

    registry = registry.connect(domainOwner);

    let tx = await registry.claimOrganizationOwnership(
      testDomain.registryBytes32,
      testDomain.node,
      organizationOwnerAddress
    );

    registry = registry.connect(organizationOwner);

    tx = await registry.setOrganizationController(
      testDomain.organizationId,
      organizationControllerAddress
    );

    await expectEvent(tx, "OrganizationControllerChanged", {
      organizationId: testDomain.organizationId,
      previousController: ethers.constants.AddressZero,
      newController: organizationControllerAddress,
    });

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
    const organizationControllerAddress =
      await organizationController.getAddress();
    const organizationControllerAddress2 =
      await organizationController2.getAddress();

    const testDomain = new EnsDomain("test-domain");

    await ens.registerDomainName(owner, domainOwner, testDomain);

    registry = registry.connect(domainOwner);

    let tx = await registry.claimOrganizationOwnership(
      testDomain.registryBytes32,
      testDomain.node,
      organizationOwnerAddress
    );

    registry = registry.connect(organizationOwner);

    tx = await registry.setOrganizationController(
      testDomain.organizationId,
      organizationControllerAddress
    );

    await tx.wait();

    registry = registry.connect(organizationController);

    tx = await registry.transferOrganizationControl(
      testDomain.organizationId,
      organizationControllerAddress2
    );

    await expectEvent(tx, "OrganizationControllerChanged", {
      organizationId: testDomain.organizationId,
      previousController: organizationControllerAddress,
      newController: organizationControllerAddress2,
    });

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

    registry = registry.connect(domainOwner);

    const tx = await registry.claimOrganizationOwnership(
      testDomain.registryBytes32,
      testDomain.node,
      organizationOwnerAddress1
    );

    await tx.wait();

    expect(
      await registry.organizationOwner(testDomain.organizationId)
    ).to.equal(organizationOwnerAddress1);

    registry = registry.connect(organizationOwner);

    let promise = registry.transferOrganizationControl(
      testDomain.organizationId,
      organizationControllerAddress2
    );

    await expect(promise).to.revertedWith(
      "reverted with custom error 'OnlyOrganizationController()'"
    );

    registry = registry.connect(randomAcc);

    promise = registry.transferOrganizationControl(
      testDomain.organizationId,
      organizationControllerAddress2
    );

    await expect(promise).to.revertedWith(
      "reverted with custom error 'OnlyOrganizationController()'"
    );
  });
});
