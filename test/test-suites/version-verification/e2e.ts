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

    const ensLinkFactory = await ethers.getContractFactory("EnsLink");
    const ensLink = await ensLinkFactory.deploy(ens.ensRegistry!.address);

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
      formatBytes32String("xdai"),
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

    await registryL1.updateVersionPublisher(versionVerificationManagerL1.address);
    await versionVerificationManagerL1.updateVerificationRootUpdater(verificationRootBridgeLinkL1.address);
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

    await votingMachine.updateVersionDecidedListener(verificationTreeManager.address);

    const ownershipBridgeLinkFactory = await ethers.getContractFactory("OwnershipBridgeLinkMock");
    ownershipBridgeLinkL2 = await ownershipBridgeLinkFactory.deploy(
      ethers.constants.AddressZero,
      packageOwnershipManagerL2.address,
      formatBytes32String("ethereum"),
      formatBytes32String("1"),
      1
    );

    const versionVerificationManagerFactory = await ethers.getContractFactory("VersionVerificationManager");
    versionVerificationManagerL2 = await versionVerificationManagerFactory.deploy(registryL2.address);
    await registryL1.updateVersionPublisher(versionVerificationManagerL2.address);

    const verificationRootBridgeLinkFactory = await ethers.getContractFactory("VerificationRootBridgeLinkMock");
    verificationRootBridgeLinkL2 = await verificationRootBridgeLinkFactory.deploy(
      ethers.constants.AddressZero,
      formatBytes32String("1"),
      1
    );

    await verificationRootBridgeLinkL2.updateVersionVerificationManager(versionVerificationManagerL2.address);

    const verificationRootRelayerFactory = await ethers.getContractFactory("VerificationRootRelayer");
    verificationRootRelayer = await verificationRootRelayerFactory.deploy(versionVerificationManagerL2.address, 5);

    await verificationTreeManager.updateVerificationRootRelayer(verificationRootRelayer.address);
    await verificationRootBridgeLinkL2.updateVerificationRootRelayer(verificationRootRelayer.address);
    await versionVerificationManagerL2.updateVerificationRootUpdater(verificationRootRelayer.address);
    await verificationRootRelayer.updateBridgeLink(verificationRootBridgeLinkL2.address);
    await verificationRootRelayer.updateVerificationTreeManager(verificationTreeManager.address);
  };

  beforeEach(async () => {
    await deployL1();
    await deployL2();

    await packageOwnershipManagerL1.updateOutgoingBridgeLink(
      EnsDomain.RegistryBytes32,
      formatBytes32String("xdai"),
      ownershipBridgeLinkL1.address
    );

    await packageOwnershipManagerL2.updateIncomingBridgeLink(
      EnsDomain.RegistryBytes32,
      formatBytes32String("ethereum"),
      ownershipBridgeLinkL2.address
    );

    await ownershipBridgeLinkL1.updateBridgeLink(ownershipBridgeLinkL2.address);
    await ownershipBridgeLinkL2.updateBridgeLink(ownershipBridgeLinkL1.address);

    await verificationRootBridgeLinkL1.updateBridgeLink(verificationRootBridgeLinkL2.address);
    await verificationRootBridgeLinkL2.updateBridgeLink(verificationRootBridgeLinkL1.address);

    await votingMachine.authorizeVerifiers([verifier1.address]);
  });


  it("can propose and publish a version", async () => {
    const packageLocation = "test-location";

    const majorNodeId = solidityKeccak256(["bytes32", "uint256"], [testDomain.packageId, 1]);
    const minorNodeId = solidityKeccak256(["bytes32", "uint256"], [majorNodeId, 0]);
    const patchNodeId = solidityKeccak256(["bytes32", "uint256"], [minorNodeId, 0]);

    const proposedVersionId = solidityKeccak256(["bytes32", "string"], [patchNodeId, "test-location"]);

    packageOwnershipManagerL1 = packageOwnershipManagerL1.connect(polywrapOwner);
    registryL1 = registryL1.connect(polywrapOwner);
    registryL2 = registryL2.connect(polywrapOwner);

    await packageOwnershipManagerL1.relayOwnership(
      formatBytes32String("xdai"),
      EnsDomain.RegistryBytes32,
      testDomain.node
    );

    await registrar.updateRegistry(registryL2.address);
    registrar = registrar.connect(polywrapOwner);

    console.log(await registrar.registry());
    console.log(await registryL2.getPackageOwner(testDomain.packageId));
    await registrar.proposeVersion(
      testDomain.packageId,
      1, 0, 0,
      packageLocation
    );

    votingMachine = votingMachine.connect(verifier1);

    await votingMachine.vote([
      {
        proposedVersionId: proposedVersionId,
        approved: true
      }
    ]);

    const a = solidityKeccak256(["bytes32", "bool"], [proposedVersionId, true]);

    console.log("Leaf", a);
    console.log("Root", await versionVerificationManagerL2.verificationRoot());

    const l2Tx = await versionVerificationManagerL2.publishVersion(
      testDomain.packageId,
      patchNodeId,
      1, 0, 0,
      "test-location",
      [],
      0
    );

    await expectEvent(l2Tx, "VersionPublished", {
      packageId: testDomain.packageId,
      major: 1,
      minor: 0,
      patch: 0,
      location: packageLocation
    });

    const l1Tx = await versionVerificationManagerL1.publishVersion(
      testDomain.packageId,
      patchNodeId,
      1, 0, 0,
      packageLocation,
      [],
      0
    );

    await expectEvent(l1Tx, "VersionPublished", {
      packageId: testDomain.packageId,
      major: 1,
      minor: 0,
      patch: 0,
      location: packageLocation
    });
  });
});
