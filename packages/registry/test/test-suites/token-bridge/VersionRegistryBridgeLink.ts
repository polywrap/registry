/*
import { ethers } from "hardhat";
import chai, { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { RegistryBridgeLink } from "../typechain";


describe("Bridge Info", () => {
  let owner: SignerWithAddress;
  let randomAcc1: SignerWithAddress;
  let randomAcc2: SignerWithAddress;
  let randomAcc3: SignerWithAddress;
  let randomAcc4: SignerWithAddress;

  let versionRegistryBridgeLink: RegistryBridgeLink;

  before(async () => {
    const [_owner, _randomAcc1, _randomAcc2, _randomAcc3, _randomAcc4] = await ethers.getSigners();
    owner = _owner;
    randomAcc1 = _randomAcc1;
    randomAcc2 = _randomAcc2;
    randomAcc3 = _randomAcc3;
    randomAcc4 = _randomAcc4;
  });

  it("allows owner to set bridge info", async () => {
    const versionRegistryBridgeLinkFactory = await ethers.getContractFactory("RegistryBridgeLink");
    versionRegistryBridgeLink = await versionRegistryBridgeLinkFactory.deploy(randomAcc1.address, randomAcc2.address, 100000);

    expect(
      await versionRegistryBridgeLink.bridgeAddress()
    ).to.be.equal(randomAcc1.address);


    expect(
      await versionRegistryBridgeLink.votingMachineBridgeLinkAddres()
    ).to.be.equal(randomAcc2.address);


    expect(
      await versionRegistryBridgeLink.gasLimit()
    ).to.be.equal(100000);

    await versionRegistryBridgeLink.setBridgeInfo(randomAcc3.address, randomAcc4.address, 200000);

    expect(
      await versionRegistryBridgeLink.bridgeAddress()
    ).to.be.equal(randomAcc3.address);

    expect(
      await versionRegistryBridgeLink.votingMachineBridgeLinkAddres()
    ).to.be.equal(randomAcc4.address);

    expect(
      await versionRegistryBridgeLink.gasLimit()
    ).to.be.equal(200000);
  });

  it("forbids non owner to set bridge info", async () => {
    const versionRegistryBridgeLinkFactory = await ethers.getContractFactory("RegistryBridgeLink");
    versionRegistryBridgeLink = await versionRegistryBridgeLinkFactory.deploy(randomAcc1.address, randomAcc2.address, 100000);

    versionRegistryBridgeLink = versionRegistryBridgeLink.connect(randomAcc1);

    await expect(
      versionRegistryBridgeLink.setBridgeInfo(randomAcc3.address, randomAcc4.address, 200000)
    ).to.revertedWith("Ownable: caller is not the owner");
  });
});*/
