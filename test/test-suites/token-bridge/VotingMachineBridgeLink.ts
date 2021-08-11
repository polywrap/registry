
/*import { ethers } from "hardhat";
import chai, { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { VotingMachineBridgeLink } from "../typechain";


describe("Bridge Info", () => {
  let owner: SignerWithAddress;
  let randomAcc1: SignerWithAddress;
  let randomAcc2: SignerWithAddress;
  let randomAcc3: SignerWithAddress;
  let randomAcc4: SignerWithAddress;
  let randomAcc5: SignerWithAddress;
  let randomAcc6: SignerWithAddress;

  let votingMachineBridgeLink: VotingMachineBridgeLink;

  before(async () => {
    const [_owner, _randomAcc1, _randomAcc2, _randomAcc3, _randomAcc4, _randomAcc5, _randomAcc6] = await ethers.getSigners();
    owner = _owner;
    randomAcc1 = _randomAcc1;
    randomAcc2 = _randomAcc2;
    randomAcc3 = _randomAcc3;
    randomAcc4 = _randomAcc4;
    randomAcc5 = _randomAcc5;
    randomAcc6 = _randomAcc6;
  });

  it("allows owner to set bridge info", async () => {
    const votingMachineBridgeLinkFactory = await ethers.getContractFactory("VotingMachineBridgeLink");
    votingMachineBridgeLink = await votingMachineBridgeLinkFactory.deploy(
      randomAcc1.address,
      randomAcc2.address,
      randomAcc3.address,
      ethers.utils.formatBytes32String("1")
    );

    expect(
      await votingMachineBridgeLink.versionRegistryAddress()
    ).to.be.equal(randomAcc1.address);


    expect(
      await votingMachineBridgeLink.bridgeAddress()
    ).to.be.equal(randomAcc2.address);


    expect(
      await votingMachineBridgeLink.versionRegistryBridgeLinkAddress()
    ).to.be.equal(randomAcc3.address);

    expect(
      await votingMachineBridgeLink.bridgeChainId()
    ).to.be.equal(ethers.utils.formatBytes32String("1"));

    await votingMachineBridgeLink.setBridgeInfo(
      randomAcc4.address,
      randomAcc5.address,
      randomAcc6.address,
      ethers.utils.formatBytes32String("2")
    );

    expect(
      await votingMachineBridgeLink.versionRegistryAddress()
    ).to.be.equal(randomAcc4.address);


    expect(
      await votingMachineBridgeLink.bridgeAddress()
    ).to.be.equal(randomAcc5.address);


    expect(
      await votingMachineBridgeLink.versionRegistryBridgeLinkAddress()
    ).to.be.equal(randomAcc6.address);

    expect(
      await votingMachineBridgeLink.bridgeChainId()
    ).to.be.equal(ethers.utils.formatBytes32String("2"));
  });

  it("forbids non owner to set bridge info", async () => {
    const votingMachineBridgeLinkFactory = await ethers.getContractFactory("VotingMachineBridgeLink");
    votingMachineBridgeLink = await votingMachineBridgeLinkFactory.deploy(
      randomAcc1.address,
      randomAcc2.address,
      randomAcc3.address,
      ethers.utils.formatBytes32String("1")
    );

    votingMachineBridgeLink = votingMachineBridgeLink.connect(randomAcc1);

    await expect(
      votingMachineBridgeLink.setBridgeInfo(
        randomAcc4.address,
        randomAcc5.address,
        randomAcc6.address,
        ethers.utils.formatBytes32String("2")
      )
    ).to.revertedWith("Ownable: caller is not the owner");
  });
});*/