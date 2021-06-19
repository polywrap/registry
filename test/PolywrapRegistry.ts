
import { ethers } from "hardhat";
import chai, { expect } from "chai";
import { PolywrapRegistry } from "../typechain";
import { expectEvent, getEventArgs } from "./helpers";
import { BigNumberish, BytesLike } from "ethers";
import { deployENS } from "./helpers/ens/deployENS";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ENSApi } from "./helpers/ens/ENSApi";
import { ensDomain } from "./helpers/ensDomain";


describe("ENS registration", () => {
  let owner: SignerWithAddress;
  let domainOwner: SignerWithAddress;
  let polywrapController: SignerWithAddress;
  let randomAcc: SignerWithAddress;

  let polywrapRegistry: PolywrapRegistry;
  let ens: ENSApi;
  const domainLabel = "test-domain";

  beforeEach(async () => {
    const [_owner, _domainOwner, _polywrapController, _randomAcc] = await ethers.getSigners();
    owner = _owner;
    domainOwner = _domainOwner;
    polywrapController = _polywrapController;
    randomAcc = _randomAcc;

    ens = await deployENS(owner);
  });

  it("can register a domain", async () => {
    await ens.registerDomainName(domainOwner, domainLabel);
  });

  it("can set polywrap controller", async () => {
    await ens.registerDomainName(domainOwner, domainLabel);

    await ens.setPolywrapController(domainOwner, domainLabel, polywrapController.address);

    const actualController = await ens.getPolywrapController(domainLabel);

    expect(actualController).to.equal(polywrapController.address);
  });

  it("can change polywrap controller", async () => {
    await ens.registerDomainName(domainOwner, domainLabel);

    await ens.setPolywrapController(domainOwner, domainLabel, polywrapController.address);

    const actualController1 = await ens.getPolywrapController(domainLabel);

    expect(actualController1).to.equal(polywrapController.address);

    await ens.setPolywrapController(domainOwner, domainLabel, randomAcc.address);

    const actualController2 = await ens.getPolywrapController(domainLabel);

    expect(actualController2).to.equal(randomAcc.address);
  });
});

describe("API registration", () => {
  const testDomain = ensDomain("test-domain");

  let polywrapRegistry: PolywrapRegistry;
  let ens: ENSApi;
  let owner: SignerWithAddress;
  let domainOwner: SignerWithAddress;
  let polywrapController: SignerWithAddress;
  let randomAcc: SignerWithAddress;

  beforeEach(async () => {
    const [_owner, _domainOwner, _polywrapController, _randomAcc] = await ethers.getSigners();
    owner = _owner;
    domainOwner = _domainOwner;
    polywrapController = _polywrapController;
    randomAcc = _randomAcc;

    ens = await deployENS(owner);

    const versionRegistryFactory = await ethers.getContractFactory("PolywrapRegistry");

    polywrapRegistry = await versionRegistryFactory.deploy(ens.ensRegistry.address);

    await ens.registerDomainName(domainOwner, testDomain.label);
    await ens.setPolywrapController(domainOwner, testDomain.label, polywrapController.address);

    polywrapRegistry = polywrapRegistry.connect(polywrapController);
  });

  it("can register a new API", async () => {
    const tx = await polywrapRegistry.registerNewWeb3API(testDomain.node);

    await expectEvent(tx, "NewWeb3API", {
      ensNode: testDomain.node
    });
  });

  it("can register multiple APIs", async () => {
    const api1 = ensDomain("test-api");
    const api2 = ensDomain("test-api2");

    await ens.registerDomainName(domainOwner, api1.label);
    await ens.setPolywrapController(domainOwner, api1.label, polywrapController.address);

    const tx1 = await polywrapRegistry.registerNewWeb3API(api1.node);

    await expectEvent(tx1, "NewWeb3API", {
      ensNode: api1.node
    });

    await ens.registerDomainName(domainOwner, api2.label);
    await ens.setPolywrapController(domainOwner, api2.label, polywrapController.address);

    const tx2 = await polywrapRegistry.registerNewWeb3API(api2.node);

    await expectEvent(tx2, "NewWeb3API", {
      ensNode: api2.node
    });
  });

  it("forbids registering the same API more than once", async () => {
    const tx = await polywrapRegistry.registerNewWeb3API(testDomain.node);

    await expectEvent(tx, "NewWeb3API", {
      ensNode: testDomain.node
    });

    await expect(
      polywrapRegistry.registerNewWeb3API(testDomain.node)
    ).to.revertedWith("API is already registered");
  });

  it("forbids registering an API to non controllers", async () => {
    polywrapRegistry = polywrapRegistry.connect(randomAcc);

    await expect(
      polywrapRegistry.registerNewWeb3API(testDomain.node)
    ).to.revertedWith("You do not have access to the specified ENS domain");
  });
});

describe("Version registation", function () {
  const testDomain = ensDomain("test-domain");

  let polywrapRegistry: PolywrapRegistry;
  let domainOwner: SignerWithAddress;
  let polywrapController: SignerWithAddress;
  let ens: ENSApi;

  beforeEach(async () => {
    const [owner, _domainOwner, _polywrapController] = await ethers.getSigners();
    domainOwner = _domainOwner;
    polywrapController = _polywrapController;

    ens = await deployENS(owner);

    const versionRegistryFactory = await ethers.getContractFactory("PolywrapRegistry");

    polywrapRegistry = await versionRegistryFactory.deploy(ens.ensRegistry.address);

    await ens.registerDomainName(domainOwner, testDomain.label);
    await ens.setPolywrapController(domainOwner, testDomain.label, polywrapController.address);

    polywrapRegistry = polywrapRegistry.connect(polywrapController);

    const tx = await polywrapRegistry.registerNewWeb3API(testDomain.node);
  });

  it("can publish a new version", async function () {
    const apiLocation = "location";

    const newVersionTx = await polywrapRegistry.publishNewVersion(testDomain.node, 1, 0, 0, apiLocation);

    await expectEvent(newVersionTx, "NewVersion", {
      ensNode: testDomain.node,
      major: 1,
      minor: 0,
      patch: 0,
      location: apiLocation
    });
  });

  it("can publish multiple versions", async function () {
    const apiLocation1 = "location1";
    const apiLocation2 = "location2";

    await polywrapRegistry.publishNewVersion(testDomain.node, 1, 0, 0, apiLocation1);
    const newVersionTx = await polywrapRegistry.publishNewVersion(testDomain.node, 1, 0, 1, apiLocation2);

    await expectEvent(newVersionTx, "NewVersion", {
      ensNode: testDomain.node,
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

    await polywrapRegistry.publishNewVersion(testDomain.node, 1, 0, 0, apiLocation_1_0_0);
    await polywrapRegistry.publishNewVersion(testDomain.node, 1, 0, 1, apiLocation_1_0_1);
    await polywrapRegistry.publishNewVersion(testDomain.node, 1, 1, 0, apiLocation_1_1_0);
    await polywrapRegistry.publishNewVersion(testDomain.node, 1, 1, 1, apiLocation_1_1_1);
    await polywrapRegistry.publishNewVersion(testDomain.node, 2, 0, 0, apiLocation_2_0_0);
    await polywrapRegistry.publishNewVersion(testDomain.node, 2, 0, 1, apiLocation_2_0_1);

    expect(await polywrapRegistry.resolveLatestMajorVersion(testDomain.node)).to.equal(apiLocation_2_0_1);

    expect(await polywrapRegistry.resolveLatestMinorVersion(testDomain.node, 1)).to.equal(apiLocation_1_1_1);
    expect(await polywrapRegistry.resolveLatestMinorVersion(testDomain.node, 2)).to.equal(apiLocation_2_0_1);

    expect(await polywrapRegistry.resolveLatestPatchVersion(testDomain.node, 1, 0)).to.equal(apiLocation_1_0_1);
    expect(await polywrapRegistry.resolveLatestPatchVersion(testDomain.node, 1, 1)).to.equal(apiLocation_1_1_1);
    expect(await polywrapRegistry.resolveLatestPatchVersion(testDomain.node, 2, 0)).to.equal(apiLocation_2_0_1);

    expect(await polywrapRegistry.resolveVersion(testDomain.node, 1, 0, 0)).to.equal(apiLocation_1_0_0);
  });

  it("can publish specific versions", async function () {
    const apiLocation1 = "location1";
    const apiLocation2 = "location2";

    await expectEvent(
      await polywrapRegistry.publishNewVersion(testDomain.node, 1, 2, 3, apiLocation1),
      "NewVersion",
      {
        ensNode: testDomain.node,
        major: 1,
        minor: 2,
        patch: 3,
        location: apiLocation1
      });

    await expectEvent(
      await polywrapRegistry.publishNewVersion(testDomain.node, 2, 2, 3, apiLocation2),
      "NewVersion",
      {
        ensNode: testDomain.node,
        major: 2,
        minor: 2,
        patch: 3,
        location: apiLocation2
      });

    expect(await polywrapRegistry.resolveLatestMajorVersion(testDomain.node)).to.equal(apiLocation2);
    expect(await polywrapRegistry.resolveLatestMinorVersion(testDomain.node, 1)).to.equal(apiLocation1);
    expect(await polywrapRegistry.resolveLatestMinorVersion(testDomain.node, 2)).to.equal(apiLocation2);
  });

  it("forbids publishing same version more than once", async function () {
    const apiLocation1 = "location1";
    const apiLocation2 = "location2";

    await polywrapRegistry.publishNewVersion(testDomain.node, 1, 0, 0, apiLocation1);

    await expect(
      polywrapRegistry.publishNewVersion(testDomain.node, 1, 0, 0, apiLocation1)
    )
      .to.revertedWith("Version is already published");

    await expect(
      polywrapRegistry.publishNewVersion(testDomain.node, 1, 0, 0, apiLocation2)
    )
      .to.revertedWith("Version is already published");
  });
});