
import { ethers } from "hardhat";
import chai, { expect } from "chai";
import { PolywrapRegistry } from "../typechain";
import { expectEvent, getEventArgs } from "./helpers";
import { BigNumber, BigNumberish, BytesLike } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { EnsDomain } from "./helpers/EnsDomain";
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

  let polywrapRegistry: PolywrapRegistry;
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

    const versionRegistryFactory = await ethers.getContractFactory("PolywrapRegistry");
    polywrapRegistry = await versionRegistryFactory.deploy(ens.ensRegistry!.address);
    polywrapRegistry = polywrapRegistry.connect(polywrapController);
  });

  it("can register a new API", async () => {
    const tx = await polywrapRegistry.registerNewWeb3API(testDomain.node);

    await expectEvent(tx, "NewWeb3API", {
      ensNode: testDomain.node,
      apiId: testDomain.apiId
    });
  });

  it("can register multiple APIs", async () => {
    const api1 = new EnsDomain("test-api");
    const api2 = new EnsDomain("test-api2");

    await ens.registerDomainName(domainOwner, api1);
    await ens.setPolywrapController(domainOwner, api1, polywrapController.address);

    const tx1 = await polywrapRegistry.registerNewWeb3API(api1.node);

    await expectEvent(tx1, "NewWeb3API", {
      ensNode: api1.node,
      apiId: api1.apiId
    });

    await ens.registerDomainName(domainOwner, api2);
    await ens.setPolywrapController(domainOwner, api2, polywrapController.address);

    const tx2 = await polywrapRegistry.registerNewWeb3API(api2.node);

    await expectEvent(tx2, "NewWeb3API", {
      ensNode: api2.node,
      apiId: api2.apiId
    });
  });

  it("forbids registering the same API more than once", async () => {
    const tx = await polywrapRegistry.registerNewWeb3API(testDomain.node);

    await expectEvent(tx, "NewWeb3API", {
      ensNode: testDomain.node,
      apiId: testDomain.apiId
    });

    await expect(
      polywrapRegistry.registerNewWeb3API(testDomain.node)
    ).to.revertedWith("API is already registered");
  });

  it("forbids registering an API to non controllers", async () => {
    polywrapRegistry = polywrapRegistry.connect(randomAcc);

    await expect(
      polywrapRegistry.registerNewWeb3API(testDomain.node)
    ).to.revertedWith("You do not have access to the ENS domain");
  });
});

describe("Version registation", function () {
  const testDomain = new EnsDomain("test-domain");

  let polywrapRegistry: PolywrapRegistry;
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
    const versionRegistryFactory = await ethers.getContractFactory("PolywrapRegistry");
    polywrapRegistry = await versionRegistryFactory.deploy(ens.ensRegistry!.address);
    polywrapRegistry = polywrapRegistry.connect(polywrapController);

    await polywrapRegistry.registerNewWeb3API(testDomain.node);
  });

  it("can publish a new version", async function () {
    const apiLocation = "location";

    const newVersionTx = await polywrapRegistry.publishNewVersion(testDomain.apiId, 1, 0, 0, apiLocation);

    await expectEvent(newVersionTx, "NewVersion", {
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

    await polywrapRegistry.publishNewVersion(testDomain.apiId, 1, 0, 0, apiLocation1);
    const newVersionTx = await polywrapRegistry.publishNewVersion(testDomain.apiId, 1, 0, 1, apiLocation2);

    await expectEvent(newVersionTx, "NewVersion", {
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

    await polywrapRegistry.publishNewVersion(testDomain.apiId, 1, 0, 0, apiLocation_1_0_0);
    await polywrapRegistry.publishNewVersion(testDomain.apiId, 1, 0, 1, apiLocation_1_0_1);
    await polywrapRegistry.publishNewVersion(testDomain.apiId, 1, 1, 0, apiLocation_1_1_0);
    await polywrapRegistry.publishNewVersion(testDomain.apiId, 1, 1, 1, apiLocation_1_1_1);
    await polywrapRegistry.publishNewVersion(testDomain.apiId, 2, 0, 0, apiLocation_2_0_0);
    await polywrapRegistry.publishNewVersion(testDomain.apiId, 2, 0, 1, apiLocation_2_0_1);

    expect(await getPackageLocation(polywrapRegistry, testDomain)).to.equal(apiLocation_2_0_1);

    expect(await getPackageLocation(polywrapRegistry, testDomain, 1)).to.equal(apiLocation_1_1_1);
    expect(await getPackageLocation(polywrapRegistry, testDomain, 2)).to.equal(apiLocation_2_0_1);

    expect(await getPackageLocation(polywrapRegistry, testDomain, 1, 0)).to.equal(apiLocation_1_0_1);
    expect(await getPackageLocation(polywrapRegistry, testDomain, 1, 1)).to.equal(apiLocation_1_1_1);
    expect(await getPackageLocation(polywrapRegistry, testDomain, 2, 0)).to.equal(apiLocation_2_0_1);

    expect(await getPackageLocation(polywrapRegistry, testDomain, 1, 0, 0)).to.equal(apiLocation_1_0_0);
  });

  it("can publish specific versions", async function () {
    const apiLocation1 = "location1";
    const apiLocation2 = "location2";

    await expectEvent(
      await polywrapRegistry.publishNewVersion(testDomain.apiId, 1, 2, 3, apiLocation1),
      "NewVersion",
      {
        apiId: testDomain.apiId,
        major: 1,
        minor: 2,
        patch: 3,
        location: apiLocation1
      });

    await expectEvent(
      await polywrapRegistry.publishNewVersion(testDomain.apiId, 2, 2, 3, apiLocation2),
      "NewVersion",
      {
        apiId: testDomain.apiId,
        major: 2,
        minor: 2,
        patch: 3,
        location: apiLocation2
      });

    expect(await getPackageLocation(polywrapRegistry, testDomain)).to.equal(apiLocation2);
    expect(await getPackageLocation(polywrapRegistry, testDomain, 1)).to.equal(apiLocation1);
    expect(await getPackageLocation(polywrapRegistry, testDomain, 2)).to.equal(apiLocation2);
  });

  it("forbids publishing same version more than once", async function () {
    const apiLocation1 = "location1";
    const apiLocation2 = "location2";

    await polywrapRegistry.publishNewVersion(testDomain.apiId, 1, 0, 0, apiLocation1);

    await expect(
      polywrapRegistry.publishNewVersion(testDomain.apiId, 1, 0, 0, apiLocation1)
    )
      .to.revertedWith("Version is already published");

    await expect(
      polywrapRegistry.publishNewVersion(testDomain.apiId, 1, 0, 0, apiLocation2)
    )
      .to.revertedWith("Version is already published");
  });

  it("forbids publish a version of an API you don't control", async () => {
    polywrapRegistry = polywrapRegistry.connect(randomAcc);

    await expect(
      polywrapRegistry.publishNewVersion(testDomain.apiId, 1, 0, 0, "random location")
    ).to.revertedWith("You do not have access to the ENS domain of the API");
  });
});