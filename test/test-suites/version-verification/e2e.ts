import { ethers } from "hardhat";
import chai, { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { PackageOwnershipManager, PolywrapRegistry, VerificationRootRelayer, VerificationTreeManager, VersionVerificationManager, VotingMachine } from "../../../typechain";
import { EnsApi } from "../../helpers/ens/EnsApi";
import { EnsDomain } from "../../helpers/ens/EnsDomain";
import { PolywrapRegistrar } from "../../../typechain/PolywrapRegistrar";
import { formatBytes32String, keccak256, solidityKeccak256 } from "ethers/lib/utils";
import { VerificationRootBridgeLinkMock } from "../../../typechain/VerificationRootBridgeLinkMock";
import { OwnershipBridgeLinkMock } from "../../../typechain/OwnershipBridgeLinkMock";
import { expectEvent } from "../../helpers";
import { computeMerkleProof } from "../../helpers/merkle-tree/computeMerkleProof";

describe("Voting", () => {
  const testDomain = new EnsDomain("test-domain");
  const blocksPerVotingPeriod = 5;

  let registryL1: PolywrapRegistry;
  let registryL2: PolywrapRegistry;
  let registrar: PolywrapRegistrar;
  let verificationTreeManager: VerificationTreeManager;
  let verificationRootRelayer: VerificationRootRelayer;
  let packageOwnershipManagerL1: PackageOwnershipManager;
  let packageOwnershipManagerL2: PackageOwnershipManager;
  let verificationRootBridgeLinkL1: VerificationRootBridgeLinkMock;
  let verificationRootBridgeLinkL2: VerificationRootBridgeLinkMock;
  let ownershipBridgeLinkL1: OwnershipBridgeLinkMock;
  let ownershipBridgeLinkL2: OwnershipBridgeLinkMock;
  let versionVerificationManagerL1: VersionVerificationManager;
  let versionVerificationManagerL2: VersionVerificationManager;

  let ens: EnsApi;

  let owner: SignerWithAddress;
  let domainOwner: SignerWithAddress;
  let polywrapOwner: SignerWithAddress;
  let verifier1: SignerWithAddress;
  let randomAcc: SignerWithAddress;

  let votingMachine: VotingMachine;

  before(async () => {
    const [_owner, _domainOwner, _polywrapOwner, _verifier1, _randomAcc] = await ethers.getSigners();
    owner = _owner;
    domainOwner = _domainOwner;
    polywrapOwner = _polywrapOwner;
    verifier1 = _verifier1;
    randomAcc = _randomAcc;
  });

  const deployEns = async () => {
    ens = new EnsApi();
    await ens.deploy(owner);

    await ens.registerDomainName(domainOwner, testDomain);
    await ens.setPolywrapOwner(domainOwner, testDomain, polywrapOwner.address);
  };

  const deployL1 = async () => {
    await deployEns();

    const registryFactory = await ethers.getContractFactory("PolywrapRegistry");
    registryL1 = await registryFactory.deploy();

    const ensLinkFactory = await ethers.getContractFactory("EnsLink");
    const ensLink = await ensLinkFactory.deploy(ens.ensRegistry?.address!);

    const packageOwnershipManagerFactory = await ethers.getContractFactory("PackageOwnershipManager");
    packageOwnershipManagerL1 = await packageOwnershipManagerFactory.deploy(
      registryL1.address,
      [formatBytes32String("ens")],
      [ensLink.address]
    );

    const ownershipBridgeLinkFactory = await ethers.getContractFactory("OwnershipBridgeLinkMock");
    ownershipBridgeLinkL1 = await ownershipBridgeLinkFactory.deploy(
      ethers.constants.AddressZero,
      packageOwnershipManagerL1.address,
      formatBytes32String("l2-chain-name"),
      formatBytes32String("2"),
      1
    );

    const verificationRootBridgeLinkFactory = await ethers.getContractFactory("VerificationRootBridgeLinkMock");
    verificationRootBridgeLinkL1 = await verificationRootBridgeLinkFactory.deploy(
      ethers.constants.AddressZero,
      formatBytes32String("2"),
      1
    );

    const versionVerificationManagerFactory = await ethers.getContractFactory("VersionVerificationManager");
    versionVerificationManagerL1 = await versionVerificationManagerFactory.deploy(registryL1.address);

    await verificationRootBridgeLinkL1.updateVersionVerificationManager(versionVerificationManagerL1.address);

    await registryL1.updateOwnershipUpdater(packageOwnershipManagerL1.address);
    await registryL1.updateVersionPublisher(versionVerificationManagerL1.address);
    await versionVerificationManagerL1.updateVerificationRootUpdater(verificationRootBridgeLinkL1.address);
    await packageOwnershipManagerL1.updateOutgoingBridgeLink(EnsDomain.RegistryBytes32, formatBytes32String("l2-chain-name"), ownershipBridgeLinkL1.address);
    await packageOwnershipManagerL1.updateLocalDomainRegistryPermission(EnsDomain.RegistryBytes32, true);
  };

  const deployL2 = async () => {
    const registryFactory = await ethers.getContractFactory("PolywrapRegistry");
    registryL2 = await registryFactory.deploy();

    const registrarFactory = await ethers.getContractFactory("PolywrapRegistrar");
    registrar = await registrarFactory.deploy(registryL2.address);

    const votingMachineFactory = await ethers.getContractFactory("VotingMachine");
    votingMachine = await votingMachineFactory.deploy(registrar.address);

    await registrar.updateVotingMachine(votingMachine.address);

    const packageOwnershipManagerFactory = await ethers.getContractFactory("PackageOwnershipManager");
    packageOwnershipManagerL2 = await packageOwnershipManagerFactory.deploy(
      registryL2.address,
      [],
      []
    );

    await registryL2.updateOwnershipUpdater(packageOwnershipManagerL2.address);

    const verificationTreeManagerFactory = await ethers.getContractFactory("VerificationTreeManager");
    verificationTreeManager = await verificationTreeManagerFactory.deploy(registryL2.address, votingMachine.address);

    await votingMachine.updateVersionVerifiedListener(verificationTreeManager.address);

    const ownershipBridgeLinkFactory = await ethers.getContractFactory("OwnershipBridgeLinkMock");
    ownershipBridgeLinkL2 = await ownershipBridgeLinkFactory.deploy(
      ethers.constants.AddressZero,
      packageOwnershipManagerL2.address,
      formatBytes32String("l1-chain-name"),
      formatBytes32String("1"),
      1
    );

    const versionVerificationManagerFactory = await ethers.getContractFactory("VersionVerificationManager");
    versionVerificationManagerL2 = await versionVerificationManagerFactory.deploy(registryL2.address);

    const verificationRootBridgeLinkFactory = await ethers.getContractFactory("VerificationRootBridgeLinkMock");
    verificationRootBridgeLinkL2 = await verificationRootBridgeLinkFactory.deploy(
      ethers.constants.AddressZero,
      formatBytes32String("1"),
      1
    );

    await verificationRootBridgeLinkL2.updateVersionVerificationManager(versionVerificationManagerL2.address);

    const verificationRootRelayerFactory = await ethers.getContractFactory("VerificationRootRelayer");
    verificationRootRelayer = await verificationRootRelayerFactory.deploy(versionVerificationManagerL2.address, 5);

    await registryL2.updateOwnershipUpdater(packageOwnershipManagerL2.address);
    await registryL2.updateVersionPublisher(versionVerificationManagerL2.address);
    await verificationTreeManager.updateVerificationRootRelayer(verificationRootRelayer.address);
    await verificationRootBridgeLinkL2.updateVerificationRootRelayer(verificationRootRelayer.address);
    await versionVerificationManagerL2.updateVerificationRootUpdater(verificationRootRelayer.address);
    await verificationRootRelayer.updateBridgeLink(verificationRootBridgeLinkL2.address);
    await verificationRootRelayer.updateVerificationTreeManager(verificationTreeManager.address);

    await packageOwnershipManagerL2.updateIncomingBridgeLink(EnsDomain.RegistryBytes32, formatBytes32String("l1-chain-name"), ownershipBridgeLinkL2.address);
  };

  beforeEach(async () => {
    await deployL1();
    await deployL2();

    await packageOwnershipManagerL1.updateOutgoingBridgeLink(
      EnsDomain.RegistryBytes32,
      formatBytes32String("l2-chain-name"),
      ownershipBridgeLinkL1.address
    );

    await packageOwnershipManagerL2.updateIncomingBridgeLink(
      EnsDomain.RegistryBytes32,
      formatBytes32String("l1-chain-name"),
      ownershipBridgeLinkL2.address
    );

    await ownershipBridgeLinkL1.updateBridgeLink(ownershipBridgeLinkL2.address);
    await ownershipBridgeLinkL2.updateBridgeLink(ownershipBridgeLinkL1.address);

    await verificationRootBridgeLinkL1.updateBridgeLink(verificationRootBridgeLinkL2.address);
    await verificationRootBridgeLinkL2.updateBridgeLink(verificationRootBridgeLinkL1.address);

    await votingMachine.authorizeVerifiers([verifier1.address]);
  });


  it("can propose and publish a version", async () => {
    packageOwnershipManagerL1 = packageOwnershipManagerL1.connect(polywrapOwner);
    registryL1 = registryL1.connect(polywrapOwner);
    registryL2 = registryL2.connect(polywrapOwner);
    versionVerificationManagerL1 = versionVerificationManagerL1.connect(polywrapOwner);
    versionVerificationManagerL2 = versionVerificationManagerL2.connect(polywrapOwner);

    await registrar.updateRegistry(registryL2.address);

    packageOwnershipManagerL1.updateOwnership(EnsDomain.RegistryBytes32, testDomain.node);
    packageOwnershipManagerL1.relayOwnership(formatBytes32String("l2-chain-name"), EnsDomain.RegistryBytes32, testDomain.node);

    const packageLocation = "test-location";

    const leaves: string[] = [];

    for (let i = 0; i < 20; i++) {
      const major = 1;
      const minor = 0;
      const patch = i;

      const majorNodeId = solidityKeccak256(["bytes32", "uint256"], [testDomain.packageId, major]);
      const minorNodeId = solidityKeccak256(["bytes32", "uint256"], [majorNodeId, minor]);
      const patchNodeId = solidityKeccak256(["bytes32", "uint256"], [minorNodeId, patch]);

      const nextMinorNodeId = ethers.constants.HashZero;
      const prevMinorNodeId = ethers.constants.HashZero;

      const packageLocation = "test-location";
      const packageLocationHash = solidityKeccak256(["string"], [packageLocation]);
      const verifiedVersionId = solidityKeccak256(["bytes32", "bytes32"], [patchNodeId, packageLocationHash]);

      leaves.push(verifiedVersionId);

      await packageOwnershipManagerL1.relayOwnership(
        formatBytes32String("l2-chain-name"),
        EnsDomain.RegistryBytes32,
        testDomain.node
      );

      registrar = registrar.connect(polywrapOwner);

      const proposeTx = await registrar.proposeVersion(
        testDomain.packageId,
        major, minor, patch,
        packageLocationHash
      );

      votingMachine = votingMachine.connect(verifier1);

      const voteTx = await votingMachine.vote([
        {
          patchNodeId: patchNodeId,
          packageLocationHash: packageLocationHash,
          nextMinorNodeId: nextMinorNodeId,
          prevMinorNodeId: prevMinorNodeId,
          approved: true
        }
      ]);

      await expectEvent(voteTx, "VersionVote", {
        verifier: verifier1.address,
        patchNodeId: patchNodeId,
        packageLocationHash: packageLocationHash,
        approved: true
      });

      const [proof, sides] = computeMerkleProof(leaves, i);

      const l2Tx = await versionVerificationManagerL2.publishVersion(
        testDomain.packageId,
        patchNodeId,
        major, minor, patch,
        packageLocation,
        proof,
        sides,
      );

      await expectEvent(l2Tx, "VersionPublished", {
        packageId: testDomain.packageId,
        major: major,
        minor: minor,
        patch: patch,
        location: packageLocation
      });

      const versionNodeL2 = await registryL2.versionNodes(patchNodeId);
      expect(versionNodeL2.leaf).to.be.true;
      expect(versionNodeL2.created).to.be.true;
      expect(versionNodeL2.latestSubVersion).to.equal(0);
      expect(versionNodeL2.location).to.equal(packageLocation);

      const l1Tx = await versionVerificationManagerL1.publishVersion(
        testDomain.packageId,
        patchNodeId,
        major, minor, patch,
        packageLocation,
        proof,
        sides
      );

      await expectEvent(l1Tx, "VersionPublished", {
        packageId: testDomain.packageId,
        major: major,
        minor: minor,
        patch: patch,
        location: packageLocation
      });

      const versionNodeL1 = await registryL2.versionNodes(patchNodeId);
      expect(versionNodeL1.leaf).to.be.true;
      expect(versionNodeL1.created).to.be.true;
      expect(versionNodeL1.latestSubVersion).to.equal(0);
      expect(versionNodeL1.location).to.equal(packageLocation);
    }
  });
});
