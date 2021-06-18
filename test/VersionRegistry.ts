
import { ethers } from "hardhat";
import chai, { expect } from "chai";
import { VersionRegistry__factory, VersionRegistry } from "../typechain";
import { expectEvent, getEventArgs } from "./helpers";
import { BigNumberish } from "ethers";

describe("API registration", () => {
  it("register new API", async () => {
    const apiName = "test-api";

    const contractFactory = await ethers.getContractFactory("VersionRegistry");

    const versionRegistry = await contractFactory.deploy();

    const tx = await versionRegistry.registerNewWeb3API(apiName);

    await expectEvent(tx, "NewWeb3API", {
      name: apiName
    });
  });

  it("register 2 new APIs", async () => {
    const apiName1 = "test-api1";
    const apiName2 = "test-api2";

    const contractFactory = await ethers.getContractFactory("VersionRegistry");

    const versionRegistry = await contractFactory.deploy();

    const tx1 = await versionRegistry.registerNewWeb3API(apiName1);

    await expectEvent(tx1, "NewWeb3API", {
      name: apiName1
    });

    const tx2 = await versionRegistry.registerNewWeb3API(apiName2);

    await expectEvent(tx2, "NewWeb3API", {
      name: apiName2
    });
  });
});

describe("Version registation", function () {
  const apiName = "test-api";

  let versionRegistry: VersionRegistry;
  let apiId: BigNumberish;

  beforeEach(async () => {
    const [owner] = await ethers.getSigners();

    const contractFactory = await ethers.getContractFactory("VersionRegistry");

    versionRegistry = await contractFactory.deploy();

    const tx = await versionRegistry.registerNewWeb3API(apiName);
    apiId = (await getEventArgs(tx, "NewWeb3API"))["apiId"];
  });

  it("push new version", async function () {
    const apiLocation = "dhasjhds";

    const newVersionTx = await versionRegistry.pushNewVersion(apiId, 1, 0, apiLocation);

    await expectEvent(newVersionTx, "NewVersion", {
      apiId: apiId,
      major: 1,
      minor: 0,
      patch: 0,
      location: apiLocation
    });
  });


  it("push multiple versions", async function () {
    const apiLocation1 = "location1";
    const apiLocation2 = "location2";

    await versionRegistry.pushNewVersion(apiId, 1, 0, apiLocation1);
    const newVersionTx = await versionRegistry.pushNewVersion(apiId, 1, 0, apiLocation2);

    await expectEvent(newVersionTx, "NewVersion", {
      apiId: apiId,
      major: 1,
      minor: 0,
      patch: 1,
      location: apiLocation2
    });
  });

  it("resolve api versions", async function () {
    const apiLocation_1_0_0 = "location_1_0_0";
    const apiLocation_1_0_1 = "location_1_0_1";
    const apiLocation_1_1_0 = "location_1_1_0";
    const apiLocation_1_1_1 = "location_1_1_1";
    const apiLocation_2_0_0 = "location_2_0_0";
    const apiLocation_2_0_1 = "location_2_0_1";

    await versionRegistry.pushNewVersion(apiId, 1, 0, apiLocation_1_0_0);
    await versionRegistry.pushNewVersion(apiId, 1, 0, apiLocation_1_0_1);
    await versionRegistry.pushNewVersion(apiId, 1, 1, apiLocation_1_1_0);
    await versionRegistry.pushNewVersion(apiId, 1, 1, apiLocation_1_1_1);
    await versionRegistry.pushNewVersion(apiId, 2, 0, apiLocation_2_0_0);
    await versionRegistry.pushNewVersion(apiId, 2, 0, apiLocation_2_0_1);

    expect(await versionRegistry.resolveLatestMajorVersion(apiId)).to.equal(apiLocation_2_0_1);

    expect(await versionRegistry.resolveLatestMinorVersion(apiId, 1)).to.equal(apiLocation_1_1_1);
    expect(await versionRegistry.resolveLatestMinorVersion(apiId, 2)).to.equal(apiLocation_2_0_1);

    expect(await versionRegistry.resolveLatestPatchVersion(apiId, 1, 0)).to.equal(apiLocation_1_0_1);
    expect(await versionRegistry.resolveLatestPatchVersion(apiId, 1, 1)).to.equal(apiLocation_1_1_1);
    expect(await versionRegistry.resolveLatestPatchVersion(apiId, 2, 0)).to.equal(apiLocation_2_0_1);

    expect(await versionRegistry.resolveVersion(apiId, 1, 0, 0)).to.equal(apiLocation_1_0_0);
  });
});