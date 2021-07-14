
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

describe("API registration", () => {
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

  it("can register a new API", async () => {
    const tx = await versionRegistry.registerAPI(testDomain.node);

    await expectEvent(tx, "ApiRegistered", {
      ensNode: testDomain.node,
      apiId: testDomain.apiId,
      controller: polywrapController
    });
  });

  it("can register multiple APIs", async () => {
    const api1 = new EnsDomain("test-api");
    const api2 = new EnsDomain("test-api2");

    await ens.registerDomainName(domainOwner, api1);
    await ens.setPolywrapController(domainOwner, api1, polywrapController.address);

    const tx1 = await versionRegistry.registerAPI(api1.node);

    await expectEvent(tx1, "ApiRegistered", {
      ensNode: api1.node,
      apiId: api1.apiId,
      controller: polywrapController
    });

    await ens.registerDomainName(domainOwner, api2);
    await ens.setPolywrapController(domainOwner, api2, polywrapController.address);

    const tx2 = await versionRegistry.registerAPI(api2.node);

    await expectEvent(tx2, "ApiRegistered", {
      ensNode: api2.node,
      apiId: api2.apiId,
      controller: polywrapController
    });
  });

  it("forbids registering the same API more than once", async () => {
    const tx = await versionRegistry.registerAPI(testDomain.node);

    await expectEvent(tx, "ApiRegistered", {
      ensNode: testDomain.node,
      apiId: testDomain.apiId,
      controller: polywrapController
    });

    await expect(
      versionRegistry.registerAPI(testDomain.node)
    ).to.revertedWith("API is already registered");
  });

  // it("forbids registering an API to non controllers", async () => {
  //   versionRegistry = versionRegistry.connect(randomAcc);

  //   await expect(
  //     versionRegistry.registerAPI(testDomain.node)
  //   ).to.revertedWith("You do not have access to the ENS domain");
  // });
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

    await versionRegistry.registerAPI(testDomain.node);
  });

  it("can publish a new version", async function () {
    const apiLocation = "location";

    const newVersionTx = await versionRegistry.publishNewVersion(testDomain.apiId, 1, 0, 0, apiLocation);

    await expectEvent(newVersionTx, "VersionPublished", {
      apiId: testDomain.apiId,
      major: 1,
      minor: 0,
      patch: 0,
      location: apiLocation
    });
  });

  it("can publish multiple versions", async function () {
    const apiLocation1 = "location1";
    const apiLocation2 = "location2";

    await versionRegistry.publishNewVersion(testDomain.apiId, 1, 0, 0, apiLocation1);
    const newVersionTx = await versionRegistry.publishNewVersion(testDomain.apiId, 1, 0, 1, apiLocation2);

    await expectEvent(newVersionTx, "VersionPublished", {
      apiId: testDomain.apiId,
      major: 1,
      minor: 0,
      patch: 1,
      location: apiLocation2
    });
  });

  it("can resolve api versions", async function () {
    const apiLocation_1_0_0 = "location_1_0_0";
    const apiLocation_1_0_1 = "location_1_0_1";
    const apiLocation_1_1_0 = "location_1_1_0";
    const apiLocation_1_1_1 = "location_1_1_1";
    const apiLocation_2_0_0 = "location_2_0_0";
    const apiLocation_2_0_1 = "location_2_0_1";

    await versionRegistry.publishNewVersion(testDomain.apiId, 1, 0, 0, apiLocation_1_0_0);
    await versionRegistry.publishNewVersion(testDomain.apiId, 1, 0, 1, apiLocation_1_0_1);
    await versionRegistry.publishNewVersion(testDomain.apiId, 1, 1, 0, apiLocation_1_1_0);
    await versionRegistry.publishNewVersion(testDomain.apiId, 1, 1, 1, apiLocation_1_1_1);
    await versionRegistry.publishNewVersion(testDomain.apiId, 2, 0, 0, apiLocation_2_0_0);
    await versionRegistry.publishNewVersion(testDomain.apiId, 2, 0, 1, apiLocation_2_0_1);

    expect(await getPackageLocation(versionRegistry, testDomain)).to.equal(apiLocation_2_0_1);

    expect(await getPackageLocation(versionRegistry, testDomain, 1)).to.equal(apiLocation_1_1_1);
    expect(await getPackageLocation(versionRegistry, testDomain, 2)).to.equal(apiLocation_2_0_1);

    expect(await getPackageLocation(versionRegistry, testDomain, 1, 0)).to.equal(apiLocation_1_0_1);
    expect(await getPackageLocation(versionRegistry, testDomain, 1, 1)).to.equal(apiLocation_1_1_1);
    expect(await getPackageLocation(versionRegistry, testDomain, 2, 0)).to.equal(apiLocation_2_0_1);

    expect(await getPackageLocation(versionRegistry, testDomain, 1, 0, 0)).to.equal(apiLocation_1_0_0);
  });

  it("can publish specific versions", async function () {
    const apiLocation1 = "location1";
    const apiLocation2 = "location2";

    await expectEvent(
      await versionRegistry.publishNewVersion(testDomain.apiId, 1, 2, 3, apiLocation1),
      "VersionPublished",
      {
        apiId: testDomain.apiId,
        major: 1,
        minor: 2,
        patch: 3,
        location: apiLocation1
      });

    await expectEvent(
      await versionRegistry.publishNewVersion(testDomain.apiId, 2, 2, 3, apiLocation2),
      "VersionPublished",
      {
        apiId: testDomain.apiId,
        major: 2,
        minor: 2,
        patch: 3,
        location: apiLocation2
      });

    expect(await getPackageLocation(versionRegistry, testDomain)).to.equal(apiLocation2);
    expect(await getPackageLocation(versionRegistry, testDomain, 1)).to.equal(apiLocation1);
    expect(await getPackageLocation(versionRegistry, testDomain, 2)).to.equal(apiLocation2);
  });

  it("forbids publishing the same version more than once", async function () {
    const apiLocation1 = "location1";
    const apiLocation2 = "location2";

    await versionRegistry.publishNewVersion(testDomain.apiId, 1, 0, 0, apiLocation1);

    await expect(
      versionRegistry.publishNewVersion(testDomain.apiId, 1, 0, 0, apiLocation1)
    )
      .to.revertedWith("Version is already published");

    await expect(
      versionRegistry.publishNewVersion(testDomain.apiId, 1, 0, 0, apiLocation2)
    )
      .to.revertedWith("Version is already published");
  });

  it("forbids publishing a version of an API you don't own", async () => {
    versionRegistry = versionRegistry.connect(randomAcc);

    await expect(
      versionRegistry.publishNewVersion(testDomain.apiId, 1, 0, 0, "test location")
    ).to.revertedWith("You do not have access to this API");
  });
});

describe("API managers", function () {
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

    await versionRegistry.registerAPI(testDomain.node);
  });

  it("can add an API manager", async function () {
    await expectEvent(
      await versionRegistry.addApiManager(testDomain.apiId, managerAcc1.address),
      "ManagerAdded", {
      apiId: testDomain.apiId,
      manager: managerAcc1.address
    });

    const isAuthorized = await versionRegistry.isAuthorized(testDomain.apiId, managerAcc1.address);
    expect(isAuthorized).to.be.true;
  });

  it("can add multiple API managers", async function () {
    await expectEvent(
      await versionRegistry.addApiManager(testDomain.apiId, managerAcc1.address),
      "ManagerAdded", {
      apiId: testDomain.apiId,
      manager: managerAcc1.address
    });

    await expectEvent(
      await versionRegistry.addApiManager(testDomain.apiId, managerAcc2.address),
      "ManagerAdded", {
      apiId: testDomain.apiId,
      manager: managerAcc2.address
    });

    const isAuthorized1 = await versionRegistry.isAuthorized(testDomain.apiId, managerAcc1.address);
    expect(isAuthorized1).to.be.true;

    const isAuthorized2 = await versionRegistry.isAuthorized(testDomain.apiId, managerAcc2.address);
    expect(isAuthorized2).to.be.true;
  });

  it("can remove API managers", async function () {
    await versionRegistry.addApiManager(testDomain.apiId, managerAcc1.address);
    await versionRegistry.addApiManager(testDomain.apiId, managerAcc2.address);

    await expectEvent(
      await versionRegistry.removeApiManager(testDomain.apiId, managerAcc2.address),
      "ManagerRemoved", {
      apiId: testDomain.apiId,
      manager: managerAcc2.address
    });

    const isAuthorized1 = await versionRegistry.isAuthorized(testDomain.apiId, managerAcc1.address);
    expect(isAuthorized1).to.be.true;

    const isAuthorized2 = await versionRegistry.isAuthorized(testDomain.apiId, managerAcc2.address);
    expect(isAuthorized2).to.be.false;
  });

  it("can publish new versions as a manager", async () => {
    const testLocation = "test location";

    await versionRegistry.addApiManager(testDomain.apiId, managerAcc1.address);

    versionRegistry = versionRegistry.connect(managerAcc1);

    await expectEvent(
      await versionRegistry.publishNewVersion(testDomain.apiId, 1, 0, 0, testLocation),
      "VersionPublished",
      {
        apiId: testDomain.apiId,
        major: 1,
        minor: 0,
        patch: 0,
        location: testLocation
      });
  });

  it("forbids publishing a version of an API after being removed as a manager", async () => {
    await versionRegistry.addApiManager(testDomain.apiId, managerAcc1.address);
    await versionRegistry.removeApiManager(testDomain.apiId, managerAcc1.address);

    versionRegistry = versionRegistry.connect(managerAcc1);

    await expect(
      versionRegistry.publishNewVersion(testDomain.apiId, 1, 0, 0, "test location")
    ).to.revertedWith("You do not have access to this API");
  });

  it("forbids non owners to add and remove API managers", async function () {
    await versionRegistry.addApiManager(testDomain.apiId, managerAcc1.address);

    versionRegistry = versionRegistry.connect(managerAcc1);

    await expect(
      versionRegistry.addApiManager(testDomain.apiId, managerAcc2.address)
    ).to.revertedWith("You do not have access to the ENS domain");

    await expect(
      versionRegistry.removeApiManager(testDomain.apiId, managerAcc1.address)
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
    await ens.setPolywrapController(domainOwner, testDomain, polywrapController.address);
  });

  beforeEach(async () => {
    const versionRegistryFactory = await ethers.getContractFactory("PolywrapVersionRegistry");
    versionRegistry = await versionRegistryFactory.deploy(ens.ensRegistry!.address);
    versionRegistry = versionRegistry.connect(polywrapController);

    await versionRegistry.registerAPI(testDomain.node);
  });

  it("can change ownership", async function () {
    let isAuthorized = await versionRegistry.isAuthorized(testDomain.apiId, polywrapController.address);
    expect(isAuthorized).to.be.true;

    isAuthorized = await versionRegistry.isAuthorized(testDomain.apiId, polywrapController2.address);
    expect(isAuthorized).to.be.false;

    await ens.setPolywrapController(domainOwner, testDomain, polywrapController2.address);

    versionRegistry = versionRegistry.connect(polywrapController2);
    await versionRegistry.claimOwnership(testDomain.apiId, polywrapController2.address);

    isAuthorized = await versionRegistry.isAuthorized(testDomain.apiId);
    expect(isAuthorized).to.be.true;

    isAuthorized = await versionRegistry.isAuthorized(testDomain.apiId, polywrapController.address);
    expect(isAuthorized).to.be.false;
  });

  it("anyone can claim ownership for the controller", async function () {
    let isAuthorized = await versionRegistry.isAuthorized(testDomain.apiId, polywrapController.address);
    expect(isAuthorized).to.be.true;

    isAuthorized = await versionRegistry.isAuthorized(testDomain.apiId, polywrapController2.address);
    expect(isAuthorized).to.be.false;

    await ens.setPolywrapController(domainOwner, testDomain, polywrapController2.address);

    versionRegistry = versionRegistry.connect(randomAcc);
    await versionRegistry.claimOwnership(testDomain.apiId);

    isAuthorized = await versionRegistry.isAuthorized(testDomain.apiId, polywrapController2.address);
    expect(isAuthorized).to.be.true;

    isAuthorized = await versionRegistry.isAuthorized(testDomain.apiId, polywrapController.address);
    expect(isAuthorized).to.be.false;
  });

  it("can change polywrap-controller without affecting ownership", async function () {
    let isAuthorized = await versionRegistry.isAuthorized(testDomain.apiId, polywrapController.address);
    expect(isAuthorized).to.be.true;

    isAuthorized = await versionRegistry.isAuthorized(testDomain.apiId, polywrapController2.address);
    expect(isAuthorized).to.be.false;

    await ens.setPolywrapController(domainOwner, testDomain, polywrapController2.address);

    isAuthorized = await versionRegistry.isAuthorized(testDomain.apiId, polywrapController.address);
    expect(isAuthorized).to.be.true;

    isAuthorized = await versionRegistry.isAuthorized(testDomain.apiId, polywrapController2.address);
    expect(isAuthorized).to.be.false;
  });
});