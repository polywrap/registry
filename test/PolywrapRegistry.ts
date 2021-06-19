
import { ethers } from "hardhat";
import chai, { expect } from "chai";
import { PolywrapRegistry } from "../typechain";
import { expectEvent, getEventArgs } from "./helpers";
import { BigNumberish, BytesLike } from "ethers";
import { deployENS } from "./helpers/ens/deployENS";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ENSApi } from "./helpers/ens/ENSApi";


describe("ENS registration", () => {
  let owner: SignerWithAddress;
  let domainOwner: SignerWithAddress;
  let polywrapController: SignerWithAddress;
  let randomAcc: SignerWithAddress;

  let polywrapRegistry: PolywrapRegistry;
  let ens: ENSApi;
  const domainName = "test-domain";

  beforeEach(async () => {
    const [_owner, _domainOwner, _polywrapController, _randomAcc] = await ethers.getSigners();
    owner = _owner;
    domainOwner = _domainOwner;
    polywrapController = _polywrapController;
    randomAcc = _randomAcc;

    ens = await deployENS();
  });

  it("can register a domain", async () => {
    await ens.registerDomainName(domainOwner.address, domainName);
  });

  it("can set polywrap controller", async () => {
    await ens.registerDomainName(domainOwner.address, domainName);

    await ens.setPolywrapController(domainOwner, domainName, polywrapController.address);

    const actualController = await ens.getPolywrapController(domainName);

    expect(actualController).to.equal(polywrapController.address);
  });

  it("can change polywrap controller", async () => {
    await ens.registerDomainName(domainOwner.address, domainName);

    await ens.setPolywrapController(domainOwner, domainName, polywrapController.address);

    const actualController1 = await ens.getPolywrapController(domainName);

    expect(actualController1).to.equal(polywrapController.address);

    await ens.setPolywrapController(domainOwner, domainName, randomAcc.address);

    const actualController2 = await ens.getPolywrapController(domainName);

    expect(actualController2).to.equal(randomAcc.address);
  });
});

describe("API registration", () => {
  const apiName = "test-api";
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

    ens = await deployENS();

    const versionRegistryFactory = await ethers.getContractFactory("PolywrapRegistry");

    polywrapRegistry = await versionRegistryFactory.deploy(ens.ensRegistry.address, ens.ensPublicResolver.address);

    await ens.registerDomainName(domainOwner.address, apiName);
    await ens.setPolywrapController(domainOwner, apiName, polywrapController.address);

    polywrapRegistry = polywrapRegistry.connect(polywrapController);
  });

  it("can register a new API", async () => {
    const res = await polywrapRegistry.aa(ethers.utils.id(apiName));
    console.log(polywrapController.address);
    console.log(res);

    const tx = await polywrapRegistry.registerNewWeb3API(ethers.utils.id(apiName));

    await expectEvent(tx, "NewWeb3API", {
      name: ethers.utils.id(apiName)
    });
  });

  it("can register multiple APIs", async () => {
    const apiName = "test-api";
    const apiName2 = "test-api2";

    const tx1 = await polywrapRegistry.registerNewWeb3API(ethers.utils.id(apiName));

    await expectEvent(tx1, "NewWeb3API", {
      name: ethers.utils.id(apiName)
    });

    await ens.registerDomainName(domainOwner.address, apiName2);
    await ens.setPolywrapController(domainOwner, apiName2, polywrapController.address);

    const tx2 = await polywrapRegistry.registerNewWeb3API(ethers.utils.id(apiName2));

    await expectEvent(tx2, "NewWeb3API", {
      name: ethers.utils.id(apiName2)
    });
  });

  it("forbids registering the same API more than once", async () => {
    const apiName = "test-api";

    const tx = await polywrapRegistry.registerNewWeb3API(ethers.utils.id(apiName));

    await expectEvent(tx, "NewWeb3API", {
      name: ethers.utils.id(apiName)
    });

    await expect(
      polywrapRegistry.registerNewWeb3API(ethers.utils.id(apiName))
    ).to.revertedWith("API is already registered");
  });

  it("forbids registering an API to non controllers", async () => {
    const apiName = "test-api";

    polywrapRegistry = polywrapRegistry.connect(randomAcc);

    await expect(
      polywrapRegistry.registerNewWeb3API(ethers.utils.id(apiName))
    ).to.revertedWith("You do not have access to the specified ENS domain");
  });
});

describe("Version registation", function () {
  const apiName = "test-api";

  let polywrapRegistry: PolywrapRegistry;
  let domainOwner: SignerWithAddress;
  let polywrapController: SignerWithAddress;
  let ens: ENSApi;
  let apiId: BytesLike;

  beforeEach(async () => {
    const [owner, _domainOwner, _polywrapController] = await ethers.getSigners();
    domainOwner = _domainOwner;
    polywrapController = _polywrapController;

    ens = await deployENS();

    const versionRegistryFactory = await ethers.getContractFactory("PolywrapRegistry");

    polywrapRegistry = await versionRegistryFactory.deploy(ens.ensRegistry.address, ens.ensPublicResolver.address);

    await ens.registerDomainName(domainOwner.address, apiName);
    await ens.setPolywrapController(domainOwner, apiName, polywrapController.address);

    polywrapRegistry = polywrapRegistry.connect(polywrapController);

    const tx = await polywrapRegistry.registerNewWeb3API(ethers.utils.id(apiName));
    apiId = (await getEventArgs(tx, "NewWeb3API"))["apiId"];
  });

  it("can publish a new version", async function () {
    const apiLocation = "location";

    const newVersionTx = await polywrapRegistry.publishNewVersion(apiId, 1, 0, 0, apiLocation);

    await expectEvent(newVersionTx, "NewVersion", {
      apiId: apiId,
      major: 1,
      minor: 0,
      patch: 0,
      location: apiLocation
    });
  });

  it("can publish multiple versions", async function () {
    const apiLocation1 = "location1";
    const apiLocation2 = "location2";

    await polywrapRegistry.publishNewVersion(apiId, 1, 0, 0, apiLocation1);
    const newVersionTx = await polywrapRegistry.publishNewVersion(apiId, 1, 0, 1, apiLocation2);

    await expectEvent(newVersionTx, "NewVersion", {
      apiId: apiId,
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

    await polywrapRegistry.publishNewVersion(apiId, 1, 0, 0, apiLocation_1_0_0);
    await polywrapRegistry.publishNewVersion(apiId, 1, 0, 1, apiLocation_1_0_1);
    await polywrapRegistry.publishNewVersion(apiId, 1, 1, 0, apiLocation_1_1_0);
    await polywrapRegistry.publishNewVersion(apiId, 1, 1, 1, apiLocation_1_1_1);
    await polywrapRegistry.publishNewVersion(apiId, 2, 0, 0, apiLocation_2_0_0);
    await polywrapRegistry.publishNewVersion(apiId, 2, 0, 1, apiLocation_2_0_1);

    expect(await polywrapRegistry.resolveLatestMajorVersion(apiId)).to.equal(apiLocation_2_0_1);

    expect(await polywrapRegistry.resolveLatestMinorVersion(apiId, 1)).to.equal(apiLocation_1_1_1);
    expect(await polywrapRegistry.resolveLatestMinorVersion(apiId, 2)).to.equal(apiLocation_2_0_1);

    expect(await polywrapRegistry.resolveLatestPatchVersion(apiId, 1, 0)).to.equal(apiLocation_1_0_1);
    expect(await polywrapRegistry.resolveLatestPatchVersion(apiId, 1, 1)).to.equal(apiLocation_1_1_1);
    expect(await polywrapRegistry.resolveLatestPatchVersion(apiId, 2, 0)).to.equal(apiLocation_2_0_1);

    expect(await polywrapRegistry.resolveVersion(apiId, 1, 0, 0)).to.equal(apiLocation_1_0_0);
  });

  it("can publish specific versions", async function () {
    const apiLocation1 = "location1";
    const apiLocation2 = "location2";

    await expectEvent(
      await polywrapRegistry.publishNewVersion(apiId, 1, 2, 3, apiLocation1),
      "NewVersion",
      {
        apiId: apiId,
        major: 1,
        minor: 2,
        patch: 3,
        location: apiLocation1
      });

    await expectEvent(
      await polywrapRegistry.publishNewVersion(apiId, 2, 2, 3, apiLocation2),
      "NewVersion",
      {
        apiId: apiId,
        major: 2,
        minor: 2,
        patch: 3,
        location: apiLocation2
      });

    expect(await polywrapRegistry.resolveLatestMajorVersion(apiId)).to.equal(apiLocation2);
    expect(await polywrapRegistry.resolveLatestMinorVersion(apiId, 1)).to.equal(apiLocation1);
    expect(await polywrapRegistry.resolveLatestMinorVersion(apiId, 2)).to.equal(apiLocation2);
  });

  it("forbids publishing same version more than once", async function () {
    const apiLocation1 = "location1";
    const apiLocation2 = "location2";

    await polywrapRegistry.publishNewVersion(apiId, 1, 0, 0, apiLocation1);

    await expect(
      polywrapRegistry.publishNewVersion(apiId, 1, 0, 0, apiLocation1)
    )
      .to.revertedWith("Version is already published");

    await expect(
      polywrapRegistry.publishNewVersion(apiId, 1, 0, 0, apiLocation2)
    )
      .to.revertedWith("Version is already published");
  });
});