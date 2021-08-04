
import { ethers } from "hardhat";
import chai, { expect } from "chai";
import { PolywrapVersionRegistry } from "../typechain";
import { expectEvent, getEventArgs } from "./helpers";
import { BigNumber, BigNumberish, BytesLike } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { EnsDomain } from "./helpers/ens/EnsDomain";
import { EnsApi } from "./helpers/ens/EnsApi";
import { getPackageLocation } from "./helpers/getPackageLocation";
import { toUtf8Bytes, toUtf8String } from "ethers/lib/utils";
import { EnsLink } from "../typechain/EnsLink";
import { TestLink } from "../typechain/TestLink";
import { TestDomain } from "./helpers/ens/TestDomain";


describe("ENS registration", () => {
  let owner: SignerWithAddress;
  let domainOwner: SignerWithAddress;
  let polywrapOwner: SignerWithAddress;
  let randomAcc: SignerWithAddress;

  let ens: EnsApi;
  const testDomain = new EnsDomain("test-domain");

  before(async () => {
    const [_owner, _domainOwner, _polywrapOwner, _randomAcc] = await ethers.getSigners();
    owner = _owner;
    domainOwner = _domainOwner;
    polywrapOwner = _polywrapOwner;
    randomAcc = _randomAcc;
  });

  beforeEach(async () => {
    ens = new EnsApi();
    await ens.deploy(owner);
  });

  it("can register a domain", async () => {
    await ens.registerDomainName(domainOwner, testDomain);
  });

  it("can set polywrap-owner", async () => {
    await ens.registerDomainName(domainOwner, testDomain);

    await ens.setPolywrapOwner(domainOwner, testDomain, polywrapOwner.address);

    const actualOwner = await ens.getPolywrapOwner(testDomain);

    expect(actualOwner).to.equal(polywrapOwner.address);
  });

  it("can change polywrap-owner", async () => {
    await ens.registerDomainName(domainOwner, testDomain);

    await ens.setPolywrapOwner(domainOwner, testDomain, polywrapOwner.address);

    const actualOwner1 = await ens.getPolywrapOwner(testDomain);

    expect(actualOwner1).to.equal(polywrapOwner.address);

    await ens.setPolywrapOwner(domainOwner, testDomain, randomAcc.address);

    const actualOwner2 = await ens.getPolywrapOwner(testDomain);

    expect(actualOwner2).to.equal(randomAcc.address);
  });
});

describe("Domain registrar links", () => {
  const testDomain = new EnsDomain("test-domain");

  let versionRegistry: PolywrapVersionRegistry;
  let ens: EnsApi;

  let owner: SignerWithAddress;
  let domainOwner: SignerWithAddress;
  let polywrapOwner: SignerWithAddress;
  let randomAcc: SignerWithAddress;

  let ensLink: EnsLink;
  let testLink: TestLink;

  before(async () => {
    const [_owner, _domainOwner, _polywrapOwner, _randomAcc] = await ethers.getSigners();
    owner = _owner;
    domainOwner = _domainOwner;
    polywrapOwner = _polywrapOwner;
    randomAcc = _randomAcc;
  });

  beforeEach(async () => {
    ens = new EnsApi();
    await ens.deploy(owner);

    const ensLinkFactory = await ethers.getContractFactory("EnsLink");
    ensLink = await ensLinkFactory.deploy(ens.ensRegistry!.address);

    const testLinkFactory = await ethers.getContractFactory("TestLink");
    testLink = await testLinkFactory.deploy();
  });

  it("can deploy the version registry with domain registrar links", async () => {
    const versionRegistryFactory = await ethers.getContractFactory("PolywrapVersionRegistry");
    versionRegistry = await versionRegistryFactory.deploy([
      EnsDomain.RegistrarBytes32,
      TestDomain.RegistrarBytes32
    ], [
      ensLink.address,
      testLink.address
    ]);

    const ensAddress = await versionRegistry.domainRegistrarLinks(EnsDomain.RegistrarBytes32);
    expect(ensAddress).to.equal(ensLink.address);

    const testAddress = await versionRegistry.domainRegistrarLinks(TestDomain.RegistrarBytes32);
    expect(testAddress).to.equal(testLink.address);
  });

  it("can connect a new domain registrar link", async () => {
    const versionRegistryFactory = await ethers.getContractFactory("PolywrapVersionRegistry");
    versionRegistry = await versionRegistryFactory.deploy([
      EnsDomain.RegistrarBytes32
    ], [
      ensLink.address
    ]);

    await versionRegistry.connectDomainRegistrarLink(TestDomain.RegistrarBytes32, testLink.address);

    const ensAddress = await versionRegistry.domainRegistrarLinks(EnsDomain.RegistrarBytes32);
    expect(ensAddress).to.equal(ensLink.address);

    const testAddress = await versionRegistry.domainRegistrarLinks(TestDomain.RegistrarBytes32);
    expect(testAddress).to.equal(testLink.address);
  });


  it("forbids non version registry owners to connect a new domain registrar link", async () => {
    const versionRegistryFactory = await ethers.getContractFactory("PolywrapVersionRegistry");
    versionRegistry = await versionRegistryFactory.deploy([
      EnsDomain.RegistrarBytes32
    ], [
      ensLink.address
    ]);

    versionRegistry = versionRegistry.connect(randomAcc);

    await expect(
      versionRegistry.connectDomainRegistrarLink(TestDomain.RegistrarBytes32, testLink.address)
    ).to.revertedWith("Ownable: caller is not the owner");
  });
});

describe("Package registration", () => {
  const testDomain = new EnsDomain("test-domain");

  let versionRegistry: PolywrapVersionRegistry;
  let ens: EnsApi;

  let owner: SignerWithAddress;
  let domainOwner: SignerWithAddress;
  let polywrapOwner: SignerWithAddress;
  let randomAcc: SignerWithAddress;

  before(async () => {
    const [_owner, _domainOwner, _polywrapOwner, _randomAcc] = await ethers.getSigners();
    owner = _owner;
    domainOwner = _domainOwner;
    polywrapOwner = _polywrapOwner;
    randomAcc = _randomAcc;
  });

  beforeEach(async () => {
    ens = new EnsApi();
    await ens.deploy(owner);

    const ensLinkFactory = await ethers.getContractFactory("EnsLink");
    const ensLink = await ensLinkFactory.deploy(ens.ensRegistry!.address);

    await ens.registerDomainName(domainOwner, testDomain);
    await ens.setPolywrapOwner(domainOwner, testDomain, polywrapOwner.address);

    const versionRegistryFactory = await ethers.getContractFactory("PolywrapVersionRegistry");
    versionRegistry = await versionRegistryFactory.deploy([
      EnsDomain.RegistrarBytes32
    ], [
      ensLink.address
    ]);

    versionRegistry = versionRegistry.connect(polywrapOwner);
  });

  it("can register a new package", async () => {
    const tx = await versionRegistry.updateOwnership(EnsDomain.RegistrarBytes32, testDomain.node);

    await expectEvent(tx, "OwnershipUpdated", {
      registrarNode: testDomain.node,
      packageId: testDomain.packageId,
      registrar: EnsDomain.RegistrarBytes32,
      owner: polywrapOwner.address
    });
  });

  it("can register multiple packages", async () => {
    const package1 = new EnsDomain("test-package");
    const package2 = new EnsDomain("test-package2");

    await ens.registerDomainName(domainOwner, package1);
    await ens.setPolywrapOwner(domainOwner, package1, polywrapOwner.address);

    const tx1 = await versionRegistry.updateOwnership(EnsDomain.RegistrarBytes32, package1.node);

    await expectEvent(tx1, "OwnershipUpdated", {
      registrarNode: package1.node,
      packageId: package1.packageId,
      registrar: EnsDomain.RegistrarBytes32,
      owner: polywrapOwner.address
    });

    await ens.registerDomainName(domainOwner, package2);
    await ens.setPolywrapOwner(domainOwner, package2, polywrapOwner.address);

    const tx2 = await versionRegistry.updateOwnership(EnsDomain.RegistrarBytes32, package2.node);

    await expectEvent(tx2, "OwnershipUpdated", {
      registrarNode: package2.node,
      packageId: package2.packageId,
      registrar: EnsDomain.RegistrarBytes32,
      owner: polywrapOwner.address
    });
  });

  it("allow anyone to register a package for the owner", async () => {
    versionRegistry = versionRegistry.connect(randomAcc);

    const tx = await versionRegistry.updateOwnership(EnsDomain.RegistrarBytes32, testDomain.node);

    await expectEvent(tx, "OwnershipUpdated", {
      registrarNode: testDomain.node,
      packageId: testDomain.packageId,
      registrar: EnsDomain.RegistrarBytes32,
      owner: polywrapOwner.address
    });
  });
});

describe("Version publish", function () {
  const testDomain = new EnsDomain("test-domain");

  let versionRegistry: PolywrapVersionRegistry;
  let ens: EnsApi;
  let ensLink: EnsLink;

  let owner: SignerWithAddress;
  let domainOwner: SignerWithAddress;
  let polywrapOwner: SignerWithAddress;
  let randomAcc: SignerWithAddress;

  before(async () => {
    const [_owner, _domainOwner, _polywrapOwner, _randomAcc] = await ethers.getSigners();
    owner = _owner;
    domainOwner = _domainOwner;
    polywrapOwner = _polywrapOwner;
    randomAcc = _randomAcc;

    ens = new EnsApi();
    await ens.deploy(owner);

    const ensLinkFactory = await ethers.getContractFactory("EnsLink");
    ensLink = await ensLinkFactory.deploy(ens.ensRegistry!.address);

    await ens.registerDomainName(domainOwner, testDomain);
    await ens.setPolywrapOwner(domainOwner, testDomain, polywrapOwner.address);
  });

  beforeEach(async () => {
    const versionRegistryFactory = await ethers.getContractFactory("PolywrapVersionRegistry");
    versionRegistry = await versionRegistryFactory.deploy([
      EnsDomain.RegistrarBytes32
    ], [
      ensLink.address
    ]);

    versionRegistry = versionRegistry.connect(polywrapOwner);

    await versionRegistry.updateOwnership(EnsDomain.RegistrarBytes32, testDomain.node);
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
  let ensLink: EnsLink;

  let owner: SignerWithAddress;
  let domainOwner: SignerWithAddress;
  let polywrapOwner: SignerWithAddress;
  let managerAcc1: SignerWithAddress;
  let managerAcc2: SignerWithAddress;
  let randomAcc: SignerWithAddress;

  before(async () => {
    const [_owner, _domainOwner, _polywrapOwner, _managerAcc1, _managerAcc2, _randomAcc] = await ethers.getSigners();
    owner = _owner;
    domainOwner = _domainOwner;
    polywrapOwner = _polywrapOwner;
    managerAcc1 = _managerAcc1;
    managerAcc2 = _managerAcc2;
    randomAcc = _randomAcc;

    ens = new EnsApi();
    await ens.deploy(owner);

    const ensLinkFactory = await ethers.getContractFactory("EnsLink");
    ensLink = await ensLinkFactory.deploy(ens.ensRegistry!.address);

    await ens.registerDomainName(domainOwner, testDomain);
    await ens.setPolywrapOwner(domainOwner, testDomain, polywrapOwner.address);
  });

  beforeEach(async () => {
    const versionRegistryFactory = await ethers.getContractFactory("PolywrapVersionRegistry");
    versionRegistry = await versionRegistryFactory.deploy([
      EnsDomain.RegistrarBytes32
    ], [
      ensLink.address
    ]);

    versionRegistry = versionRegistry.connect(polywrapOwner);

    await versionRegistry.updateOwnership(EnsDomain.RegistrarBytes32, testDomain.node);
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
    ).to.revertedWith("You do not have access to the domain of this package");

    await expect(
      versionRegistry.removeManager(testDomain.packageId, managerAcc1.address)
    ).to.revertedWith("You do not have access to the domain of this package");
  });
});

describe("Changing ownership", function () {
  const testDomain = new EnsDomain("test-domain");

  let versionRegistry: PolywrapVersionRegistry;
  let ens: EnsApi;
  let ensLink: EnsLink;

  let owner: SignerWithAddress;
  let domainOwner: SignerWithAddress;
  let polywrapOwner: SignerWithAddress;
  let polywrapOwner2: SignerWithAddress;
  let randomAcc: SignerWithAddress;

  before(async () => {
    const [_owner, _domainOwner, _polywrapOwner, _polywrapOwner2, _randomAcc] = await ethers.getSigners();
    owner = _owner;
    domainOwner = _domainOwner;
    polywrapOwner = _polywrapOwner;
    polywrapOwner2 = _polywrapOwner2;
    randomAcc = _randomAcc;

    ens = new EnsApi();
    await ens.deploy(owner);

    const ensLinkFactory = await ethers.getContractFactory("EnsLink");
    ensLink = await ensLinkFactory.deploy(ens.ensRegistry!.address);

    await ens.registerDomainName(domainOwner, testDomain);
  });

  beforeEach(async () => {
    await ens.setPolywrapOwner(domainOwner, testDomain, polywrapOwner.address);

    const versionRegistryFactory = await ethers.getContractFactory("PolywrapVersionRegistry");
    versionRegistry = await versionRegistryFactory.deploy([
      EnsDomain.RegistrarBytes32
    ], [
      ensLink.address
    ]);

    versionRegistry = versionRegistry.connect(polywrapOwner);

    await versionRegistry.updateOwnership(EnsDomain.RegistrarBytes32, testDomain.node);
  });

  it("can change ownership", async function () {
    let isAuthorized = await versionRegistry.isAuthorized(testDomain.packageId, polywrapOwner.address);
    expect(isAuthorized).to.be.true;

    isAuthorized = await versionRegistry.isAuthorized(testDomain.packageId, polywrapOwner2.address);
    expect(isAuthorized).to.be.false;

    await ens.setPolywrapOwner(domainOwner, testDomain, polywrapOwner2.address);

    versionRegistry = versionRegistry.connect(polywrapOwner2);
    await versionRegistry.updateOwnership(EnsDomain.RegistrarBytes32, testDomain.node);

    isAuthorized = await versionRegistry.isAuthorized(testDomain.packageId, polywrapOwner2.address);
    expect(isAuthorized).to.be.true;

    isAuthorized = await versionRegistry.isAuthorized(testDomain.packageId, polywrapOwner.address);
    expect(isAuthorized).to.be.false;
  });

  it("anyone can update ownership for the owner", async function () {
    let isAuthorized = await versionRegistry.isAuthorized(testDomain.packageId, polywrapOwner.address);
    expect(isAuthorized).to.be.true;

    isAuthorized = await versionRegistry.isAuthorized(testDomain.packageId, polywrapOwner2.address);
    expect(isAuthorized).to.be.false;

    await ens.setPolywrapOwner(domainOwner, testDomain, polywrapOwner2.address);

    versionRegistry = versionRegistry.connect(randomAcc);
    await versionRegistry.updateOwnership(EnsDomain.RegistrarBytes32, testDomain.node);

    isAuthorized = await versionRegistry.isAuthorized(testDomain.packageId, polywrapOwner2.address);
    expect(isAuthorized).to.be.true;

    isAuthorized = await versionRegistry.isAuthorized(testDomain.packageId, polywrapOwner.address);
    expect(isAuthorized).to.be.false;
  });

  it("can change polywrap-owner without affecting ownership", async function () {
    let isAuthorized = await versionRegistry.isAuthorized(testDomain.packageId, polywrapOwner.address);
    expect(isAuthorized).to.be.true;

    isAuthorized = await versionRegistry.isAuthorized(testDomain.packageId, polywrapOwner2.address);
    expect(isAuthorized).to.be.false;

    await ens.setPolywrapOwner(domainOwner, testDomain, polywrapOwner2.address);

    isAuthorized = await versionRegistry.isAuthorized(testDomain.packageId, polywrapOwner.address);
    expect(isAuthorized).to.be.true;

    isAuthorized = await versionRegistry.isAuthorized(testDomain.packageId, polywrapOwner2.address);
    expect(isAuthorized).to.be.false;
  });
});