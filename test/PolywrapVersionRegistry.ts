
import { ethers } from "hardhat";
import chai, { expect } from "chai";
import { PolywrapVersionRegistry } from "../typechain";
import { expectEvent, getEventArgs } from "./helpers";
import { BigNumber, BigNumberish, BytesLike } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { EnsDomain } from "./helpers/ens/EnsDomain";
import { EnsApi } from "./helpers/ens/EnsApi";
import { getPackageLocation } from "./helpers/getPackageLocation";


describe("ENS registration", () => {
  let owner: SignerWithAddress;
  let domainOwner: SignerWithAddress;
  let polywrapController: SignerWithAddress;
  let randomAcc: SignerWithAddress;

  let ens: EnsApi;
  const testDomain = new EnsDomain("test-domain");

  before(async () => {
    const [_owner, _domainOwner, _polywrapController, _randomAcc] = await ethers.getSigners();
    owner = _owner;
    domainOwner = _domainOwner;
    polywrapController = _polywrapController;
    randomAcc = _randomAcc;
  });

  beforeEach(async () => {
    ens = new EnsApi();
    await ens.deploy(owner);
  });

  it("can register a domain", async () => {
    await ens.registerDomainName(domainOwner, testDomain);
  });

  it("can set polywrap controller", async () => {
    await ens.registerDomainName(domainOwner, testDomain);

    await ens.setPolywrapController(domainOwner, testDomain, polywrapController.address);

    const actualController = await ens.getPolywrapController(testDomain);

    expect(actualController).to.equal(polywrapController.address);
  });

  it("can change polywrap controller", async () => {
    await ens.registerDomainName(domainOwner, testDomain);

    await ens.setPolywrapController(domainOwner, testDomain, polywrapController.address);

    const actualController1 = await ens.getPolywrapController(testDomain);

    expect(actualController1).to.equal(polywrapController.address);

    await ens.setPolywrapController(domainOwner, testDomain, randomAcc.address);

    const actualController2 = await ens.getPolywrapController(testDomain);

    expect(actualController2).to.equal(randomAcc.address);
  });
});

describe("Package registration", () => {
  const testDomain = new EnsDomain("test-domain");

  let versionRegistry: PolywrapVersionRegistry;
  let ens: EnsApi;

  let owner: SignerWithAddress;
  let domainOwner: SignerWithAddress;
  let polywrapController: SignerWithAddress;
  let randomAcc: SignerWithAddress;

  before(async () => {
    const [_owner, _domainOwner, _polywrapController, _randomAcc] = await ethers.getSigners();
    owner = _owner;
    domainOwner = _domainOwner;
    polywrapController = _polywrapController;
    randomAcc = _randomAcc;
  });

  beforeEach(async () => {
    ens = new EnsApi();
    await ens.deploy(owner);

    await ens.registerDomainName(domainOwner, testDomain);
    await ens.setPolywrapController(domainOwner, testDomain, polywrapController.address);

    const versionRegistryFactory = await ethers.getContractFactory("PolywrapVersionRegistry");
    versionRegistry = await versionRegistryFactory.deploy(ens.ensRegistry!.address);
    versionRegistry = versionRegistry.connect(polywrapController);
  });

  it("can register a new package", async () => {
    const tx = await versionRegistry.registerPackage(testDomain.node);

    await expectEvent(tx, "PackageRegistered", {
      ensNode: testDomain.node,
      packageId: testDomain.packageId,
      controller: polywrapController.address
    });
  });

  it("can register multiple packages", async () => {
    const package1 = new EnsDomain("test-package");
    const package2 = new EnsDomain("test-package2");

    await ens.registerDomainName(domainOwner, package1);
    await ens.setPolywrapController(domainOwner, package1, polywrapController.address);

    const tx1 = await versionRegistry.registerPackage(package1.node);

    await expectEvent(tx1, "PackageRegistered", {
      ensNode: package1.node,
      packageId: package1.packageId,
      controller: polywrapController.address
    });

    await ens.registerDomainName(domainOwner, package2);
    await ens.setPolywrapController(domainOwner, package2, polywrapController.address);

    const tx2 = await versionRegistry.registerPackage(package2.node);

    await expectEvent(tx2, "PackageRegistered", {
      ensNode: package2.node,
      packageId: package2.packageId,
      controller: polywrapController.address
    });
  });

  it("forbids registering the same package more than once", async () => {
    const tx = await versionRegistry.registerPackage(testDomain.node);

    await expectEvent(tx, "PackageRegistered", {
      ensNode: testDomain.node,
      packageId: testDomain.packageId,
      controller: polywrapController.address
    });

    await expect(
      versionRegistry.registerPackage(testDomain.node)
    ).to.revertedWith("Package is already registered");
  });
});

describe("Version publish", function () {
  const testDomain = new EnsDomain("test-domain");

  let versionRegistry: PolywrapVersionRegistry;
  let ens: EnsApi;

  let owner: SignerWithAddress;
  let domainOwner: SignerWithAddress;
  let polywrapController: SignerWithAddress;
  let randomAcc: SignerWithAddress;

  before(async () => {
    const [_owner, _domainOwner, _polywrapController, _randomAcc] = await ethers.getSigners();
    owner = _owner;
    domainOwner = _domainOwner;
    polywrapController = _polywrapController;
    randomAcc = _randomAcc;

    ens = new EnsApi();
    await ens.deploy(owner);

    await ens.registerDomainName(domainOwner, testDomain);
    await ens.setPolywrapController(domainOwner, testDomain, polywrapController.address);
  });

  beforeEach(async () => {
    const versionRegistryFactory = await ethers.getContractFactory("PolywrapVersionRegistry");
    versionRegistry = await versionRegistryFactory.deploy(ens.ensRegistry!.address);
    versionRegistry = versionRegistry.connect(polywrapController);

    await versionRegistry.registerPackage(testDomain.node);
  });

  it("can publish a new version", async function () {
    const packageLocation = "location";

    const newVersionTx = await versionRegistry.publishNewVersion(testDomain.packageId, 1, 0, 0, packageLocation);

    await expectEvent(newVersionTx, "VersionPublished", {
      packageId: testDomain.packageId,
      major: 1,
      minor: 0,
      patch: 0,
      location: packageLocation
    });
  });

  it("can publish multiple versions", async function () {
    const packageLocation1 = "location1";
    const packageLocation2 = "location2";

    await versionRegistry.publishNewVersion(testDomain.packageId, 1, 0, 0, packageLocation1);
    const newVersionTx = await versionRegistry.publishNewVersion(testDomain.packageId, 1, 0, 1, packageLocation2);

    await expectEvent(newVersionTx, "VersionPublished", {
      packageId: testDomain.packageId,
      major: 1,
      minor: 0,
      patch: 1,
      location: packageLocation2
    });
  });

  it("can resolve package versions", async function () {
    const packageLocation_1_0_0 = "location_1_0_0";
    const packageLocation_1_0_1 = "location_1_0_1";
    const packageLocation_1_1_0 = "location_1_1_0";
    const packageLocation_1_1_1 = "location_1_1_1";
    const packageLocation_2_0_0 = "location_2_0_0";
    const packageLocation_2_0_1 = "location_2_0_1";

    await versionRegistry.publishNewVersion(testDomain.packageId, 1, 0, 0, packageLocation_1_0_0);
    await versionRegistry.publishNewVersion(testDomain.packageId, 1, 0, 1, packageLocation_1_0_1);
    await versionRegistry.publishNewVersion(testDomain.packageId, 1, 1, 0, packageLocation_1_1_0);
    await versionRegistry.publishNewVersion(testDomain.packageId, 1, 1, 1, packageLocation_1_1_1);
    await versionRegistry.publishNewVersion(testDomain.packageId, 2, 0, 0, packageLocation_2_0_0);
    await versionRegistry.publishNewVersion(testDomain.packageId, 2, 0, 1, packageLocation_2_0_1);

    expect(await getPackageLocation(versionRegistry, testDomain)).to.equal(packageLocation_2_0_1);

    expect(await getPackageLocation(versionRegistry, testDomain, 1)).to.equal(packageLocation_1_1_1);
    expect(await getPackageLocation(versionRegistry, testDomain, 2)).to.equal(packageLocation_2_0_1);

    expect(await getPackageLocation(versionRegistry, testDomain, 1, 0)).to.equal(packageLocation_1_0_1);
    expect(await getPackageLocation(versionRegistry, testDomain, 1, 1)).to.equal(packageLocation_1_1_1);
    expect(await getPackageLocation(versionRegistry, testDomain, 2, 0)).to.equal(packageLocation_2_0_1);

    expect(await getPackageLocation(versionRegistry, testDomain, 1, 0, 0)).to.equal(packageLocation_1_0_0);
  });

  it("can publish specific versions", async function () {
    const packageLocation1 = "location1";
    const packageLocation2 = "location2";

    await expectEvent(
      await versionRegistry.publishNewVersion(testDomain.packageId, 1, 2, 3, packageLocation1),
      "VersionPublished",
      {
        packageId: testDomain.packageId,
        major: 1,
        minor: 2,
        patch: 3,
        location: packageLocation1
      });

    await expectEvent(
      await versionRegistry.publishNewVersion(testDomain.packageId, 2, 2, 3, packageLocation2),
      "VersionPublished",
      {
        packageId: testDomain.packageId,
        major: 2,
        minor: 2,
        patch: 3,
        location: packageLocation2
      });

    expect(await getPackageLocation(versionRegistry, testDomain)).to.equal(packageLocation2);
    expect(await getPackageLocation(versionRegistry, testDomain, 1)).to.equal(packageLocation1);
    expect(await getPackageLocation(versionRegistry, testDomain, 2)).to.equal(packageLocation2);
  });

  it("forbids publishing the same version more than once", async function () {
    const packageLocation1 = "location1";
    const packageLocation2 = "location2";

    await versionRegistry.publishNewVersion(testDomain.packageId, 1, 0, 0, packageLocation1);

    await expect(
      versionRegistry.publishNewVersion(testDomain.packageId, 1, 0, 0, packageLocation1)
    )
      .to.revertedWith("Version is already published");

    await expect(
      versionRegistry.publishNewVersion(testDomain.packageId, 1, 0, 0, packageLocation2)
    )
      .to.revertedWith("Version is already published");
  });

  it("forbids publishing a version of an package you don't own", async () => {
    versionRegistry = versionRegistry.connect(randomAcc);

    await expect(
      versionRegistry.publishNewVersion(testDomain.packageId, 1, 0, 0, "test location")
    ).to.revertedWith("You do not have access to this package");
  });
});

describe("Package managers", function () {
  const testDomain = new EnsDomain("test-domain");

  let versionRegistry: PolywrapVersionRegistry;
  let ens: EnsApi;

  let owner: SignerWithAddress;
  let domainOwner: SignerWithAddress;
  let polywrapController: SignerWithAddress;
  let managerAcc1: SignerWithAddress;
  let managerAcc2: SignerWithAddress;
  let randomAcc: SignerWithAddress;

  before(async () => {
    const [_owner, _domainOwner, _polywrapController, _managerAcc1, _managerAcc2, _randomAcc] = await ethers.getSigners();
    owner = _owner;
    domainOwner = _domainOwner;
    polywrapController = _polywrapController;
    managerAcc1 = _managerAcc1;
    managerAcc2 = _managerAcc2;
    randomAcc = _randomAcc;

    ens = new EnsApi();
    await ens.deploy(owner);

    await ens.registerDomainName(domainOwner, testDomain);
    await ens.setPolywrapController(domainOwner, testDomain, polywrapController.address);
  });

  beforeEach(async () => {
    const versionRegistryFactory = await ethers.getContractFactory("PolywrapVersionRegistry");
    versionRegistry = await versionRegistryFactory.deploy(ens.ensRegistry!.address);
    versionRegistry = versionRegistry.connect(polywrapController);

    await versionRegistry.registerPackage(testDomain.node);
  });

  it("can add an package manager", async function () {
    await expectEvent(
      await versionRegistry.addManager(testDomain.packageId, managerAcc1.address),
      "ManagerAdded", {
      packageId: testDomain.packageId,
      manager: managerAcc1.address
    });

    const isAuthorized = await versionRegistry.isAuthorized(testDomain.packageId, managerAcc1.address);
    expect(isAuthorized).to.be.true;
  });

  it("can add multiple package managers", async function () {
    await expectEvent(
      await versionRegistry.addManager(testDomain.packageId, managerAcc1.address),
      "ManagerAdded", {
      packageId: testDomain.packageId,
      manager: managerAcc1.address
    });

    await expectEvent(
      await versionRegistry.addManager(testDomain.packageId, managerAcc2.address),
      "ManagerAdded", {
      packageId: testDomain.packageId,
      manager: managerAcc2.address
    });

    const isAuthorized1 = await versionRegistry.isAuthorized(testDomain.packageId, managerAcc1.address);
    expect(isAuthorized1).to.be.true;

    const isAuthorized2 = await versionRegistry.isAuthorized(testDomain.packageId, managerAcc2.address);
    expect(isAuthorized2).to.be.true;
  });

  it("can remove package managers", async function () {
    await versionRegistry.addManager(testDomain.packageId, managerAcc1.address);
    await versionRegistry.addManager(testDomain.packageId, managerAcc2.address);

    await expectEvent(
      await versionRegistry.removeManager(testDomain.packageId, managerAcc2.address),
      "ManagerRemoved", {
      packageId: testDomain.packageId,
      manager: managerAcc2.address
    });

    const isAuthorized1 = await versionRegistry.isAuthorized(testDomain.packageId, managerAcc1.address);
    expect(isAuthorized1).to.be.true;

    const isAuthorized2 = await versionRegistry.isAuthorized(testDomain.packageId, managerAcc2.address);
    expect(isAuthorized2).to.be.false;
  });

  it("can publish new versions as a manager", async () => {
    const testLocation = "test location";

    await versionRegistry.addManager(testDomain.packageId, managerAcc1.address);

    versionRegistry = versionRegistry.connect(managerAcc1);

    await expectEvent(
      await versionRegistry.publishNewVersion(testDomain.packageId, 1, 0, 0, testLocation),
      "VersionPublished",
      {
        packageId: testDomain.packageId,
        major: 1,
        minor: 0,
        patch: 0,
        location: testLocation
      });
  });

  it("forbids publishing a version of a package after being removed as a manager", async () => {
    await versionRegistry.addManager(testDomain.packageId, managerAcc1.address);
    await versionRegistry.removeManager(testDomain.packageId, managerAcc1.address);

    versionRegistry = versionRegistry.connect(managerAcc1);

    await expect(
      versionRegistry.publishNewVersion(testDomain.packageId, 1, 0, 0, "test location")
    ).to.revertedWith("You do not have access to this package");
  });

  it("forbids non owners to add and remove package managers", async function () {
    await versionRegistry.addManager(testDomain.packageId, managerAcc1.address);

    versionRegistry = versionRegistry.connect(managerAcc1);

    await expect(
      versionRegistry.addManager(testDomain.packageId, managerAcc2.address)
    ).to.revertedWith("You do not have access to the ENS domain");

    await expect(
      versionRegistry.removeManager(testDomain.packageId, managerAcc1.address)
    ).to.revertedWith("You do not have access to the ENS domain");
  });
});

describe("Changing ownership", function () {
  const testDomain = new EnsDomain("test-domain");

  let versionRegistry: PolywrapVersionRegistry;
  let ens: EnsApi;

  let owner: SignerWithAddress;
  let domainOwner: SignerWithAddress;
  let polywrapController: SignerWithAddress;
  let polywrapController2: SignerWithAddress;
  let randomAcc: SignerWithAddress;

  before(async () => {
    const [_owner, _domainOwner, _polywrapController, _polywrapController2, _randomAcc] = await ethers.getSigners();
    owner = _owner;
    domainOwner = _domainOwner;
    polywrapController = _polywrapController;
    polywrapController2 = _polywrapController2;
    randomAcc = _randomAcc;

    ens = new EnsApi();
    await ens.deploy(owner);

    await ens.registerDomainName(domainOwner, testDomain);
  });

  beforeEach(async () => {
    await ens.setPolywrapController(domainOwner, testDomain, polywrapController.address);

    const versionRegistryFactory = await ethers.getContractFactory("PolywrapVersionRegistry");
    versionRegistry = await versionRegistryFactory.deploy(ens.ensRegistry!.address);
    versionRegistry = versionRegistry.connect(polywrapController);

    await versionRegistry.registerPackage(testDomain.node);
  });

  it("can change ownership", async function () {
    let isAuthorized = await versionRegistry.isAuthorized(testDomain.packageId, polywrapController.address);
    expect(isAuthorized).to.be.true;

    isAuthorized = await versionRegistry.isAuthorized(testDomain.packageId, polywrapController2.address);
    expect(isAuthorized).to.be.false;

    await ens.setPolywrapController(domainOwner, testDomain, polywrapController2.address);

    versionRegistry = versionRegistry.connect(polywrapController2);
    await versionRegistry.updateOwnership(testDomain.packageId);

    isAuthorized = await versionRegistry.isAuthorized(testDomain.packageId, polywrapController2.address);
    expect(isAuthorized).to.be.true;

    isAuthorized = await versionRegistry.isAuthorized(testDomain.packageId, polywrapController.address);
    expect(isAuthorized).to.be.false;
  });

  it("anyone can claim ownership for the controller", async function () {
    let isAuthorized = await versionRegistry.isAuthorized(testDomain.packageId, polywrapController.address);
    expect(isAuthorized).to.be.true;

    isAuthorized = await versionRegistry.isAuthorized(testDomain.packageId, polywrapController2.address);
    expect(isAuthorized).to.be.false;

    await ens.setPolywrapController(domainOwner, testDomain, polywrapController2.address);

    versionRegistry = versionRegistry.connect(randomAcc);
    await versionRegistry.updateOwnership(testDomain.packageId);

    isAuthorized = await versionRegistry.isAuthorized(testDomain.packageId, polywrapController2.address);
    expect(isAuthorized).to.be.true;

    isAuthorized = await versionRegistry.isAuthorized(testDomain.packageId, polywrapController.address);
    expect(isAuthorized).to.be.false;
  });

  it("can change polywrap-controller without affecting ownership", async function () {
    let isAuthorized = await versionRegistry.isAuthorized(testDomain.packageId, polywrapController.address);
    expect(isAuthorized).to.be.true;

    isAuthorized = await versionRegistry.isAuthorized(testDomain.packageId, polywrapController2.address);
    expect(isAuthorized).to.be.false;

    await ens.setPolywrapController(domainOwner, testDomain, polywrapController2.address);

    isAuthorized = await versionRegistry.isAuthorized(testDomain.packageId, polywrapController.address);
    expect(isAuthorized).to.be.true;

    isAuthorized = await versionRegistry.isAuthorized(testDomain.packageId, polywrapController2.address);
    expect(isAuthorized).to.be.false;
  });
});