import hre, { ethers, deployments, getNamedAccounts } from "hardhat";
import chai, { expect } from "chai";
import {
  PolywrapRegistryV1,
  PolywrapRegistryV1__factory,
  VersionResolverV1,
  VersionResolverV1__factory,
} from "../../../../typechain";
import {
  arrayify,
  BytesLike,
  concat,
  formatBytes32String,
  solidityKeccak256,
  zeroPad,
} from "ethers/lib/utils";
import {
  expectEvent,
  publishVersion,
  publishVersions,
  publishVersionWithPromise,
  toVersionNodeId,
} from "../../../helpers";
import { BigNumber, ContractTransaction, Signer } from "ethers";
import { EnsApi } from "../../../helpers/ens/EnsApi";
import { buildPolywrapPackage } from "../../../helpers/buildPolywrapPackage";
import { PolywrapPackage } from "../../../helpers/PolywrapPackage";
import { EnsDomain } from "../../../helpers/EnsDomain";

describe("Registering packages", () => {
  let registry: PolywrapRegistryV1;

  let ens: EnsApi;

  let owner: Signer;
  let domainOwner: Signer;
  let organizationOwner: Signer;
  let organizationOwner2: Signer;
  let organizationController: Signer;
  let organizationController2: Signer;
  let packageOwner: Signer;
  let packageOwner2: Signer;
  let packageController: Signer;
  let randomAcc: Signer;

  const testDomain = new EnsDomain("test-domain");

  before(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0];
    domainOwner = signers[1];
    organizationOwner = signers[2];
    organizationOwner2 = signers[3];
    organizationController = signers[4];
    organizationController2 = signers[5];
    packageOwner = signers[6];
    packageOwner2 = signers[7];
    packageController = signers[8];
    randomAcc = signers[9];
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

    await ens.registerDomainName(owner, domainOwner, testDomain);

    registry = registry.connect(domainOwner);

    const tx = await registry.claimOrganizationOwnership(
      testDomain.registryBytes32,
      testDomain.node,
      await organizationOwner.getAddress()
    );

    await tx.wait();

    registry = registry.connect(organizationOwner);
  });

  it("can register package", async () => {
    const testPackage = buildPolywrapPackage(testDomain, "test-package");
    const packageOwnerAddress = await packageOwner.getAddress();

    const tx = await registry.registerPackage(
      testDomain.organizationId,
      formatBytes32String(testPackage.packageName),
      packageOwnerAddress
    );

    await tx.wait();

    await expectEvent(tx, "PackageRegistered", {
      organizationId: testDomain.organizationId,
      packageId: testPackage.packageId,
      packageName: ethers.utils.formatBytes32String(testPackage.packageName),
      packageOwner: packageOwnerAddress,
    });

    const packageInfo = await registry.package(testPackage.packageId);
    expect(packageInfo.exists).to.be.true;
    expect(packageInfo.owner).to.equal(packageOwnerAddress);
    expect(packageInfo.controller).to.equal(ethers.constants.AddressZero);

    expect(await registry.packageExists(testPackage.packageId)).to.equal(true);

    expect(await registry.packageOwner(testPackage.packageId)).to.equal(
      packageOwnerAddress
    );

    expect(await registry.packageController(testPackage.packageId)).to.equal(
      ethers.constants.AddressZero
    );

    expect(
      await registry.listPackages(testDomain.organizationId, 0, 10)
    ).to.deep.equal([testPackage.packageId]);

    expect(await registry.packageCount(testDomain.organizationId)).to.equal(1);
  });

  it("can register multiple packages for same organization", async () => {
    const testPackage1 = buildPolywrapPackage(testDomain, "test-package1");
    const testPackage2 = buildPolywrapPackage(testDomain, "test-package2");
    const packageOwnerAddress1 = await packageOwner.getAddress();
    const packageOwnerAddress2 = await packageOwner2.getAddress();

    let tx = await registry.registerPackage(
      testDomain.organizationId,
      formatBytes32String(testPackage1.packageName),
      packageOwnerAddress1
    );

    await tx.wait();

    await expectEvent(tx, "PackageRegistered", {
      organizationId: testDomain.organizationId,
      packageId: testPackage1.packageId,
      packageName: ethers.utils.formatBytes32String(testPackage1.packageName),
      packageOwner: packageOwnerAddress1,
    });

    expect(await registry.packageExists(testPackage1.packageId)).to.equal(true);

    expect(await registry.packageOwner(testPackage1.packageId)).to.equal(
      packageOwnerAddress1
    );

    tx = await registry.registerPackage(
      testDomain.organizationId,
      formatBytes32String(testPackage2.packageName),
      packageOwnerAddress2
    );

    await tx.wait();

    await expectEvent(tx, "PackageRegistered", {
      organizationId: testDomain.organizationId,
      packageId: testPackage2.packageId,
      packageName: ethers.utils.formatBytes32String(testPackage2.packageName),
      packageOwner: packageOwnerAddress2,
    });

    expect(await registry.packageExists(testPackage2.packageId)).to.equal(true);

    expect(await registry.packageOwner(testPackage2.packageId)).to.equal(
      packageOwnerAddress2
    );

    expect(
      await registry.listPackages(testDomain.organizationId, 0, 10)
    ).to.deep.equal([testPackage1.packageId, testPackage2.packageId]);

    expect(await registry.packageCount(testDomain.organizationId)).to.equal(2);
  });

  it("can register packages for multiple organizations", async () => {
    const testDomain2 = new EnsDomain("test-domain2");
    const testPackage1 = buildPolywrapPackage(testDomain, "test-package");
    const testPackage2 = buildPolywrapPackage(testDomain2, "test-package");
    const packageOwnerAddress1 = await packageOwner.getAddress();
    const packageOwnerAddress2 = await packageOwner2.getAddress();

    await ens.registerDomainName(owner, domainOwner, testDomain2);

    registry = registry.connect(domainOwner);

    let tx = await registry.claimOrganizationOwnership(
      testDomain2.registryBytes32,
      testDomain2.node,
      await organizationOwner2.getAddress()
    );

    await tx.wait();

    registry = registry.connect(organizationOwner);

    tx = await registry.registerPackage(
      testDomain.organizationId,
      formatBytes32String(testPackage1.packageName),
      packageOwnerAddress1
    );

    await tx.wait();

    await expectEvent(tx, "PackageRegistered", {
      organizationId: testDomain.organizationId,
      packageId: testPackage1.packageId,
      packageName: ethers.utils.formatBytes32String(testPackage1.packageName),
      packageOwner: packageOwnerAddress1,
    });

    expect(await registry.packageExists(testPackage1.packageId)).to.equal(true);

    expect(await registry.packageOwner(testPackage1.packageId)).to.equal(
      packageOwnerAddress1
    );

    registry = registry.connect(organizationOwner2);

    tx = await registry.registerPackage(
      testDomain2.organizationId,
      formatBytes32String(testPackage2.packageName),
      packageOwnerAddress2
    );

    await tx.wait();

    await expectEvent(tx, "PackageRegistered", {
      organizationId: testDomain2.organizationId,
      packageId: testPackage2.packageId,
      packageName: ethers.utils.formatBytes32String(testPackage2.packageName),
      packageOwner: packageOwnerAddress2,
    });

    expect(await registry.packageExists(testPackage2.packageId)).to.equal(true);

    expect(await registry.packageOwner(testPackage2.packageId)).to.equal(
      packageOwnerAddress2
    );

    expect(
      await registry.listPackages(testDomain.organizationId, 0, 10)
    ).to.deep.equal([testPackage1.packageId]);

    expect(
      await registry.listPackages(testDomain2.organizationId, 0, 10)
    ).to.deep.equal([testPackage2.packageId]);

    expect(await registry.packageCount(testDomain.organizationId)).to.equal(1);
    expect(await registry.packageCount(testDomain2.organizationId)).to.equal(1);
  });

  it("forbids registering multiple package with the same name for the same organization", async () => {
    const testPackage1 = buildPolywrapPackage(testDomain, "test-package");
    const testPackage2 = buildPolywrapPackage(testDomain, "test-package");
    const packageOwnerAddress1 = await packageOwner.getAddress();
    const packageOwnerAddress2 = await packageOwner2.getAddress();

    const tx = await registry.registerPackage(
      testDomain.organizationId,
      formatBytes32String(testPackage1.packageName),
      packageOwnerAddress1
    );

    await tx.wait();

    const txPromise = registry.registerPackage(
      testDomain.organizationId,
      formatBytes32String(testPackage2.packageName),
      packageOwnerAddress2
    );

    await expect(txPromise).to.revertedWith(
      "reverted with custom error 'PackageAlreadyExists()'"
    );
  });

  it("allows organization owner to change package owner", async () => {
    const testPackage = buildPolywrapPackage(testDomain, "test-package");
    const packageOwnerAddress1 = await packageOwner.getAddress();
    const packageOwnerAddress2 = await packageOwner2.getAddress();

    let tx = await registry.registerPackage(
      testDomain.organizationId,
      formatBytes32String(testPackage.packageName),
      packageOwnerAddress1
    );

    await tx.wait();

    expect(await registry.packageOwner(testPackage.packageId)).to.equal(
      packageOwnerAddress1
    );

    tx = await registry.setPackageOwner(
      testPackage.packageId,
      packageOwnerAddress2
    );

    await tx.wait();

    expect(await registry.packageOwner(testPackage.packageId)).to.equal(
      packageOwnerAddress2
    );
  });

  it("allows package owner to change package owner", async () => {
    const testPackage = buildPolywrapPackage(testDomain, "test-package");
    const packageOwnerAddress1 = await packageOwner.getAddress();
    const packageOwnerAddress2 = await packageOwner2.getAddress();

    let tx = await registry.registerPackage(
      testDomain.organizationId,
      formatBytes32String(testPackage.packageName),
      packageOwnerAddress1
    );

    await tx.wait();

    expect(await registry.packageOwner(testPackage.packageId)).to.equal(
      packageOwnerAddress1
    );

    registry = registry.connect(packageOwner);

    tx = await registry.setPackageOwner(
      testPackage.packageId,
      packageOwnerAddress2
    );

    await tx.wait();

    expect(await registry.packageOwner(testPackage.packageId)).to.equal(
      packageOwnerAddress2
    );
  });

  it("forbids non package owner to change package owner", async () => {
    const testPackage = buildPolywrapPackage(testDomain, "test-package");
    const packageOwnerAddress1 = await packageOwner.getAddress();
    const packageOwnerAddress2 = await packageOwner2.getAddress();

    const tx = await registry.registerPackage(
      testDomain.organizationId,
      formatBytes32String(testPackage.packageName),
      packageOwnerAddress1
    );

    await tx.wait();

    expect(await registry.packageOwner(testPackage.packageId)).to.equal(
      packageOwnerAddress1
    );

    registry = registry.connect(randomAcc);

    const txPromise = registry.setPackageOwner(
      testPackage.packageId,
      packageOwnerAddress2
    );

    await expect(txPromise).to.revertedWith(
      "reverted with custom error 'OnlyOrganizationOrPackageOwner()'"
    );
  });

  it("allows organization owner to change package controller", async () => {
    const testPackage = buildPolywrapPackage(testDomain, "test-package");
    const packageOwnerAddress = await packageOwner.getAddress();
    const packageControllerAddress = await packageController.getAddress();

    registry = registry.connect(organizationOwner);

    let tx = await registry.registerPackage(
      testDomain.organizationId,
      formatBytes32String(testPackage.packageName),
      packageOwnerAddress
    );

    await tx.wait();

    tx = await registry.setPackageController(
      testPackage.packageId,
      packageControllerAddress
    );

    await tx.wait();

    expect(await registry.packageController(testPackage.packageId)).to.equal(
      packageControllerAddress
    );
  });

  it("allows package owner to change package controller", async () => {
    const testPackage = buildPolywrapPackage(testDomain, "test-package");
    const packageOwnerAddress = await packageOwner.getAddress();
    const packageControllerAddress = await packageController.getAddress();

    registry = registry.connect(organizationOwner);

    let tx = await registry.registerPackage(
      testDomain.organizationId,
      formatBytes32String(testPackage.packageName),
      packageOwnerAddress
    );

    await tx.wait();

    registry = registry.connect(packageOwner);

    tx = await registry.setPackageController(
      testPackage.packageId,
      packageControllerAddress
    );

    await tx.wait();

    expect(await registry.packageController(testPackage.packageId)).to.equal(
      packageControllerAddress
    );
  });

  it("allows package controller to change package controller", async () => {
    const testPackage = buildPolywrapPackage(testDomain, "test-package");
    const packageOwnerAddress = await packageOwner.getAddress();
    const packageControllerAddress = await packageController.getAddress();
    const packageControllerAddress2 = await packageController2.getAddress();

    let tx = await registry.registerPackage(
      testDomain.organizationId,
      formatBytes32String(testPackage.packageName),
      packageOwnerAddress
    );

    await tx.wait();

    registry = registry.connect(packageOwner);

    tx = await registry.setPackageController(
      testPackage.packageId,
      packageControllerAddress
    );

    await tx.wait();

    registry = registry.connect(packageController);

    tx = await registry.setPackageController(
      testPackage.packageId,
      packageControllerAddress2
    );

    await tx.wait();

    expect(await registry.packageController(testPackage.packageId)).to.equal(
      packageControllerAddress2
    );
  });

  it("forbid random account from changing package controller", async () => {
    const testPackage = buildPolywrapPackage(testDomain, "test-package");
    const packageOwnerAddress = await packageOwner.getAddress();
    const packageControllerAddress = await packageController.getAddress();

    registry = registry.connect(organizationOwner);

    const tx = await registry.registerPackage(
      testDomain.organizationId,
      formatBytes32String(testPackage.packageName),
      packageOwnerAddress
    );

    await tx.wait();

    registry = registry.connect(randomAcc);

    const txPromise = await registry.setPackageController(
      testPackage.packageId,
      packageControllerAddress
    );

    await expect(txPromise).to.revertedWith(
      "reverted with custom error 'OnlyOrganizationOwnerOrPackageOwnerOrPackageController()'"
    );
  });
  /*
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

  it("allows organization controller to set organization controller", async () => {
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

    tx = await registry.setOrganizationController(
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

  it("allows organization owner to set organization owner and controller in a single transaction", async () => {
    const organizationOwnerAddress = await organizationOwner.getAddress();
    const organizationOwnerAddress2 = await organizationOwner2.getAddress();
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

    tx = await registry.setOrganizationOwnerAndController(
      testDomain.organizationId,
      organizationOwnerAddress2,
      organizationControllerAddress
    );

    await expectEvent(tx, "OrganizationOwnerChanged", {
      organizationId: testDomain.organizationId,
      previousOwner: organizationOwnerAddress,
      newOwner: organizationOwnerAddress2,
    });

    await expectEvent(tx, "OrganizationControllerChanged", {
      organizationId: testDomain.organizationId,
      previousController: ethers.constants.AddressZero,
      newController: organizationControllerAddress,
    });

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
    const organizationControllerAddress =
      await organizationController.getAddress();

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

    registry = registry.connect(organizationController);

    const promise = registry.setOrganizationOwner(
      testDomain.organizationId,
      organizationOwnerAddress2
    );

    await expect(promise).to.revertedWith(
      "reverted with custom error 'OnlyOrganizationOwner()'"
    );
  });*/
});
