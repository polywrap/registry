import { ethers } from "hardhat";
import chai, { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { PackageOwnershipManager, PolywrapOwnershipBridgeLink, PolywrapRegistry, PolywrapVerificationRootBridgeLink, VerificationRootRelayer, VerificationTreeManager, VotingMachine } from "../../../typechain";
import { EnsApi } from "../../helpers/ens/EnsApi";
import { EnsDomain } from "../../helpers/ens/EnsDomain";
import { PolywrapRegistrar } from "../../../typechain/PolywrapRegistrar";
import { formatBytes32String } from "ethers/lib/utils";

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
  let verificationRootBridgeLinkL1: PolywrapVerificationRootBridgeLink;
  let verificationRootBridgeLinkL2: PolywrapVerificationRootBridgeLink;
  let ownershipBridgeLinkL1: PolywrapOwnershipBridgeLink;
  let ownershipBridgeLinkL2: PolywrapOwnershipBridgeLink;

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

    registryL1 = registryL1.connect(polywrapOwner);

    const ensLinkFactory = await ethers.getContractFactory("EnsLink");
    const ensLink = await ensLinkFactory.deploy(ens.ensRegistry?.address!);

    const packageOwnershipManagerFactory = await ethers.getContractFactory("PackageOwnershipManager");
    packageOwnershipManagerL1 = await packageOwnershipManagerFactory.deploy(
      registryL1.address,
      [formatBytes32String("ens")],
      [ensLink.address]
    );

    const ownershipBridgeLinkFactory = await ethers.getContractFactory("PolywrapOwnershipBridgeLink");
    ownershipBridgeLinkL1 = await ownershipBridgeLinkFactory.deploy();

    const verificationRootBridgeLinkFactory = await ethers.getContractFactory("PolywrapVerificationRootBridgeLink");
    verificationRootBridgeLinkL1 = await verificationRootBridgeLinkFactory.deploy();
  };

  const deployL2 = async () => {
    const registryFactory = await ethers.getContractFactory("PolywrapRegistry");
    registryL2 = await registryFactory.deploy();

    registryL2 = registryL2.connect(polywrapOwner);

    const votingMachineFactory = await ethers.getContractFactory("VotingMachine");
    votingMachine = await votingMachineFactory.deploy();

    const packageOwnershipManagerFactory = await ethers.getContractFactory("PackageOwnershipManager");
    packageOwnershipManagerL2 = await packageOwnershipManagerFactory.deploy(
      registryL2.address,
      [],
      []
    );

    const registrarFactory = await ethers.getContractFactory("PolywrapRegistrar");
    registrar = await registrarFactory.deploy(registryL2.address, votingMachine.address);

    const verificationTreeManagerFactory = await ethers.getContractFactory("VerificationTreeManager");
    verificationTreeManager = await verificationTreeManagerFactory.deploy();

    const ownershipBridgeLinkFactory = await ethers.getContractFactory("PolywrapOwnershipBridgeLink");
    ownershipBridgeLinkL2 = await ownershipBridgeLinkFactory.deploy();

    const verificationRootBridgeLinkFactory = await ethers.getContractFactory("PolywrapVerificationRootBridgeLink");
    verificationRootBridgeLinkL2 = await verificationRootBridgeLinkFactory.deploy();

    const verificationRootRelayerFactory = await ethers.getContractFactory("VerificationRootRelayer");
    verificationRootRelayer = await verificationRootRelayerFactory.deploy(registryL2.address, verificationRootBridgeLinkL2.address);
  };

  beforeEach(async () => {
    await deployL1();
    await deployL2();

    await votingMachine.authorizeVerifiers([verifier1.address]);
  });


  it("can propose and publish a version", async () => {
    packageOwnershipManagerL1 = packageOwnershipManagerL1.connect(polywrapOwner);
    registryL1 = registryL1.connect(polywrapOwner);

    registryL2 = registryL2.connect(polywrapOwner);

    await packageOwnershipManagerL1.relayOwnership(
      formatBytes32String("xdai"),
      EnsDomain.RegistryBytes32,
      testDomain.node
    );

    await registrar.proposeVersion(
      testDomain.packageId,
      1, 0, 0,
      "test-location"
    );

    await votingMachine.vote([
      {
        proposedVersionId: formatBytes32String(""),
        approved: true
      }
    ]);

    await registryL2.publishVersion(
      testDomain.packageId,
      formatBytes32String(""),
      1, 0, 0,
      "test-location",
      [], 1);

    await registryL1.publishVersion(
      testDomain.packageId,
      formatBytes32String(""),
      1, 0, 0,
      "test-location",
      [], 1);
  });
});
