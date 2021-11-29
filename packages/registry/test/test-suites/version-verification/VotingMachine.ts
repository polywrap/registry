/*
import { ethers } from "hardhat";
import chai, { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { VotingMachine } from "../typechain-types";


describe("Verifier node authorization", () => {
  const blocksPerVotingPeriod = 1;

  let owner: SignerWithAddress;
  let randomAcc1: SignerWithAddress;
  let randomAcc2: SignerWithAddress;
  let randomAcc3: SignerWithAddress;
  let randomAcc4: SignerWithAddress;

  let votingMachine: VotingMachine;

  before(async () => {
    const [_owner, _randomAcc1, _randomAcc2, _randomAcc3, _randomAcc4] = await ethers.getSigners();
    owner = _owner;
    randomAcc1 = _randomAcc1;
    randomAcc2 = _randomAcc2;
    randomAcc3 = _randomAcc3;
    randomAcc4 = _randomAcc4;
  });

  beforeEach(async () => {
    const votingMachineFactory = await ethers.getContractFactory("VotingMachine");
    votingMachine = await votingMachineFactory.deploy(blocksPerVotingPeriod);
  });

  it("allows owner to authorize verifiers", async () => {
    await votingMachine.authorizeVerifierAddresses([randomAcc1.address, randomAcc2.address]);

    expect(
      await votingMachine.authorizedVerifierAddresses(randomAcc1.address)
    ).to.be.true;

    expect(
      await votingMachine.authorizedVerifierAddresses(randomAcc2.address)
    ).to.be.true;

    expect(
      await votingMachine.authorizedVerifierAddresses(randomAcc3.address)
    ).to.be.false;

    expect(
      await votingMachine.authorizedVerifierAddressCount()
    ).to.equal(2);

    await votingMachine.authorizeVerifierAddresses([randomAcc3.address]);

    expect(
      await votingMachine.authorizedVerifierAddresses(randomAcc3.address)
    ).to.be.true;

    expect(
      await votingMachine.authorizedVerifierAddressCount()
    ).to.equal(3);
  });

  it("allows owner to unauthorize verifiers", async () => {
    await votingMachine.authorizeVerifierAddresses([randomAcc1.address, randomAcc2.address, randomAcc3.address]);

    expect(
      await votingMachine.authorizedVerifierAddressCount()
    ).to.equal(3);

    await votingMachine.unauthorizeVerifierAddresses([randomAcc1.address, randomAcc2.address]);

    expect(
      await votingMachine.authorizedVerifierAddresses(randomAcc1.address)
    ).to.be.false;

    expect(
      await votingMachine.authorizedVerifierAddresses(randomAcc2.address)
    ).to.be.false;

    expect(
      await votingMachine.authorizedVerifierAddresses(randomAcc3.address)
    ).to.be.true;

    expect(
      await votingMachine.authorizedVerifierAddressCount()
    ).to.equal(1);
  });

  it("can not authorize the same verifier more than once", async () => {
    await votingMachine.authorizeVerifierAddresses([randomAcc1.address, randomAcc1.address]);

    expect(
      await votingMachine.authorizedVerifierAddressCount()
    ).to.equal(1);

    await votingMachine.authorizeVerifierAddresses([randomAcc1.address]);

    expect(
      await votingMachine.authorizedVerifierAddressCount()
    ).to.equal(1);
  });


  it("can not unauthorize the same verifier more than once", async () => {
    await votingMachine.authorizeVerifierAddresses([randomAcc1.address, randomAcc2.address]);

    expect(
      await votingMachine.authorizedVerifierAddressCount()
    ).to.equal(2);

    await votingMachine.unauthorizeVerifierAddresses([randomAcc1.address]);

    expect(
      await votingMachine.authorizedVerifierAddressCount()
    ).to.equal(1);

    await votingMachine.unauthorizeVerifierAddresses([randomAcc1.address]);

    expect(
      await votingMachine.authorizedVerifierAddressCount()
    ).to.equal(1);
  });

  it("forbids non-owner to authorize verifiers", async () => {
    votingMachine = votingMachine.connect(randomAcc1);

    await expect(
      votingMachine.authorizeVerifierAddresses([randomAcc2.address])
    ).to.revertedWith("Ownable: caller is not the owner");
  });

  it("forbids non-owner to unauthorize verifiers", async () => {
    await votingMachine.authorizeVerifierAddresses([randomAcc2.address]);

    votingMachine = votingMachine.connect(randomAcc1);

    await expect(
      votingMachine.unauthorizeVerifierAddresses([randomAcc2.address])
    ).to.revertedWith("Ownable: caller is not the owner");
  });
});

describe("Voting", () => {
  const blocksPerVotingPeriod = 5;

  let owner: SignerWithAddress;
  let randomAcc1: SignerWithAddress;
  let randomAcc2: SignerWithAddress;
  let randomAcc3: SignerWithAddress;
  let randomAcc4: SignerWithAddress;

  let votingMachine: VotingMachine;

  before(async () => {
    const [_owner, _randomAcc1, _randomAcc2, _randomAcc3, _randomAcc4] = await ethers.getSigners();
    owner = _owner;
    randomAcc1 = _randomAcc1;
    randomAcc2 = _randomAcc2;
    randomAcc3 = _randomAcc3;
    randomAcc4 = _randomAcc4;
  });

  beforeEach(async () => {
    const votingMachineFactory = await ethers.getContractFactory("VotingMachine");
    votingMachine = await votingMachineFactory.deploy(blocksPerVotingPeriod);

    const versionRegistryBridgeLinkFactory = await ethers.getContractFactory("RegistryBridgeLink");
    const versionRegistryBridgeLink = await versionRegistryBridgeLinkFactory.deploy(ethers.constants.AddressZero, ethers.constants.AddressZero, 200000);

    await votingMachine.setBridgeInfo(versionRegistryBridgeLink.address);
  });


  it("can not unauthorize the same verifier more than once", async () => {
    await votingMachine.authorizeVerifierAddresses([randomAcc1.address, randomAcc2.address]);

    expect(
      await votingMachine.authorizedVerifierAddressCount()
    ).to.equal(2);

    await votingMachine.unauthorizeVerifierAddresses([randomAcc1.address]);

    expect(
      await votingMachine.authorizedVerifierAddressCount()
    ).to.equal(1);

    await votingMachine.unauthorizeVerifierAddresses([randomAcc1.address]);

    expect(
      await votingMachine.authorizedVerifierAddressCount()
    ).to.equal(1);
  });
});
*/
