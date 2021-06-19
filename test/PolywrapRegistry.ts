
import { ethers } from "hardhat";
import chai, { expect } from "chai";
import { PolywrapRegistry } from "../typechain";
import { expectEvent, getEventArgs } from "./helpers";
import { BigNumberish } from "ethers";
import { deployENS } from "./helpers/ens/deployENS";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ENSApi } from "./helpers/ens/ENSApi";


describe("ENS registration", () => {
  let domainOwner: SignerWithAddress;
  let polywrapController: SignerWithAddress;

  let polywrapRegistry: PolywrapRegistry;
  let ens: ENSApi;
  const domainName = "test-domain";

  beforeEach(async () => {
    const signers = await ethers.getSigners();
    domainOwner = signers[1];
    polywrapController = signers[2];

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
});

describe("API registration", () => {
  let polywrapRegistry: PolywrapRegistry;

  beforeEach(async () => {
    const [owner, domainOwner, polywrapController] = await ethers.getSigners();

    const versionRegistryFactory = await ethers.getContractFactory("PolywrapRegistry");

    polywrapRegistry = await versionRegistryFactory.deploy();
  });

  it("can register a new API", async () => {
    const apiName = "test-api";

    const tx = await polywrapRegistry.registerNewWeb3API(apiName);

    await expectEvent(tx, "NewWeb3API", {
      name: apiName
    });
  });

  it("can register multiple APIs", async () => {
    const apiName1 = "test-api1";
    const apiName2 = "test-api2";

    const tx1 = await polywrapRegistry.registerNewWeb3API(apiName1);

    await expectEvent(tx1, "NewWeb3API", {
      name: apiName1
    });

    const tx2 = await polywrapRegistry.registerNewWeb3API(apiName2);

    await expectEvent(tx2, "NewWeb3API", {
      name: apiName2
    });
  });

  it("forbids registering the same API more than once", async () => {
    const apiName = "test-api";

    const tx = await polywrapRegistry.registerNewWeb3API(apiName);

    await expectEvent(tx, "NewWeb3API", {
      name: apiName
    });

    await expect(
      polywrapRegistry.registerNewWeb3API(apiName)
    ).to.revertedWith("API is already registered");
  });
});

describe("Version registation", function () {
  const apiName = "test-api";

  let polywrapRegistry: PolywrapRegistry;
  let apiId: BigNumberish;

  beforeEach(async () => {
    const [owner] = await ethers.getSigners();

    const contractFactory = await ethers.getContractFactory("PolywrapRegistry");

    polywrapRegistry = await contractFactory.deploy();

    const tx = await polywrapRegistry.registerNewWeb3API(apiName);
    apiId = (await getEventArgs(tx, "NewWeb3API"))["apiId"];
  });

  it("can publish a new version", async function () {
    const apiLocation = "dhasjhds";

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