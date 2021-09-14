import { ethers, deployments, getNamedAccounts } from 'hardhat';
import chai, { expect } from "chai";
import { PackageOwnershipManager, PolywrapRegistry, VerificationRootRelayer, VerificationTreeManager, VersionVerificationManager, VotingMachine } from "../../../typechain";
import { EnsApi } from "../../helpers/ens/EnsApi";
import { PolywrapRegistrar } from "../../../typechain/PolywrapRegistrar";
import { formatBytes32String, keccak256, solidityKeccak256 } from "ethers/lib/utils";
import { VerificationRootBridgeLinkMock } from "../../../typechain/VerificationRootBridgeLinkMock";
import { OwnershipBridgeLinkMock } from "../../../typechain/OwnershipBridgeLinkMock";
import { expectEvent } from "../../helpers";
import { Signer } from 'ethers';
import { computeMerkleProof, EnsDomain } from 'registry-js';

describe("Voting", () => {
  const testDomain = new EnsDomain("test-domain");

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
  let votingMachine: VotingMachine;

  let ens = new EnsApi();

  let owner: Signer;
  let domainOwner: Signer;
  let polywrapOwner: Signer;
  let verifier1: Signer;
  let randomAcc: Signer;


  before(async () => {
    const [_owner, _domainOwner, _polywrapOwner, _verifier1, _randomAcc] = await ethers.getSigners();
    owner = _owner;
    domainOwner = _domainOwner;
    polywrapOwner = _polywrapOwner;
    verifier1 = _verifier1;
    randomAcc = _randomAcc;
  });

  beforeEach(async () => {
    await deployments.fixture(
      [
        'EnsL1',
        'SetupEnsL1',
        'PolywrapRegistryL1',
        'EnsLinkL1',
        'PackageOwnershipManagerL1',
        'OwnershipBridgeLinkL1',
        'VerificationRootBridgeLinkL1',
        'VersionVerificationManagerL1',
        'ConnectContracts',
        'PolywrapRegistryL2',
        'Registrar',
        'VotingMachine',
        'PackageOwnershipManagerL2',
        'OwnershipBridgeLinkL2',
        'VerificationTreeManager',
        'VersionVerificationManagerL2',
        'VerificationRootBridgeLinkL2',
        'VerificationRootRelayer',
        'ConnectContracts'
      ]
    );

    registryL1 = await ethers.getContract('PolywrapRegistryL1');
    registryL2 = await ethers.getContract('PolywrapRegistryL2');
    registrar = await ethers.getContract('PolywrapRegistrar');
    verificationTreeManager = await ethers.getContract('VerificationTreeManager');
    verificationRootRelayer = await ethers.getContract('VerificationRootRelayer');
    packageOwnershipManagerL1 = await ethers.getContract('PackageOwnershipManagerL1');
    packageOwnershipManagerL2 = await ethers.getContract('PackageOwnershipManagerL2');
    verificationRootBridgeLinkL1 = await ethers.getContract('VerificationRootBridgeLinkL1');
    verificationRootBridgeLinkL2 = await ethers.getContract('VerificationRootBridgeLinkL2');
    ownershipBridgeLinkL1 = await ethers.getContract('OwnershipBridgeLinkL1');
    ownershipBridgeLinkL2 = await ethers.getContract('OwnershipBridgeLinkL2');
    versionVerificationManagerL1 = await ethers.getContract('VersionVerificationManagerL1');
    versionVerificationManagerL2 = await ethers.getContract('VersionVerificationManagerL2');
    votingMachine = await ethers.getContract('VotingMachine');

    await ens.init();
    await ens.registerDomainName(domainOwner, testDomain);
    await ens.setPolywrapOwner(domainOwner, testDomain, await polywrapOwner.getAddress());

    await votingMachine.authorizeVerifiers([await verifier1.getAddress()]);
  });


  it("can propose and publish a version", async () => {
    packageOwnershipManagerL1 = packageOwnershipManagerL1.connect(polywrapOwner);
    registryL1 = registryL1.connect(polywrapOwner);
    registryL2 = registryL2.connect(polywrapOwner);
    versionVerificationManagerL1 = versionVerificationManagerL1.connect(polywrapOwner);
    versionVerificationManagerL2 = versionVerificationManagerL2.connect(polywrapOwner);

    packageOwnershipManagerL1.updateOwnership(EnsDomain.RegistryBytes32, testDomain.node);
    packageOwnershipManagerL1.relayOwnership(formatBytes32String("l2-chain-name"), EnsDomain.RegistryBytes32, testDomain.node);

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

      registrar = registrar.connect(polywrapOwner);

      const proposeTx = await registrar.proposeVersion(
        testDomain.packageId,
        major, minor, patch,
        packageLocation
      );

      await proposeTx.wait();

      votingMachine = votingMachine.connect(verifier1);

      const voteTx = await votingMachine.vote([
        {
          patchNodeId: patchNodeId,
          nextMinorNodeId: nextMinorNodeId,
          prevMinorNodeId: prevMinorNodeId,
          approved: true
        }
      ]);

      await expectEvent(voteTx, "VersionVote", {
        verifier: await verifier1.getAddress(),
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
