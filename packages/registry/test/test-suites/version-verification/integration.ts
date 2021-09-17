import hre, { ethers, deployments, getNamedAccounts } from "hardhat";
import chai, { expect } from "chai";
import {
  ENSRegistry__factory,
  OwnershipBridgeLink__factory,
  PackageOwnershipManager,
  PackageOwnershipManager__factory,
  PolywrapRegistrar__factory,
  PolywrapRegistry,
  PolywrapRegistry__factory,
  TestEthRegistrar__factory,
  TestPublicResolver__factory,
  VerificationRootBridgeLink__factory,
  VerificationRootRelayer,
  VerificationRootRelayer__factory,
  VerificationTreeManager,
  VerificationTreeManager__factory,
  VersionVerificationManager,
  VersionVerificationManager__factory,
  VotingMachine,
  VotingMachine__factory,
} from "../../../typechain";
import { EnsApi } from "../../helpers/ens/EnsApi";
import { PolywrapRegistrar } from "../../../typechain/PolywrapRegistrar";
import {
  formatBytes32String,
  keccak256,
  solidityKeccak256,
} from "ethers/lib/utils";
import { VerificationRootBridgeLinkMock } from "../../../typechain/VerificationRootBridgeLinkMock";
import { OwnershipBridgeLinkMock } from "../../../typechain/OwnershipBridgeLinkMock";
import { expectEvent } from "../../helpers";
import { Signer } from "ethers";
import { computeMerkleProof, EnsDomain } from "@polywrap/registry-core-js";

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

  let ens: EnsApi;

  let owner: Signer;
  let domainOwner: Signer;
  let polywrapOwner: Signer;
  let verifier1: Signer;
  let randomAcc: Signer;

  before(async () => {
    const [
      _owner,
      _domainOwner,
      _polywrapOwner,
      _verifier1,
      _randomAcc,
    ] = await ethers.getSigners();
    owner = _owner;
    domainOwner = _domainOwner;
    polywrapOwner = _polywrapOwner;
    verifier1 = _verifier1;
    randomAcc = _randomAcc;
  });

  beforeEach(async () => {
    const deploys = await deployments.fixture([
      "EnsL1",
      "SetupEnsL1",
      "PolywrapRegistryL1",
      "EnsLinkL1",
      "PackageOwnershipManagerL1",
      "OwnershipBridgeLinkL1",
      "VerificationRootBridgeLinkL1",
      "VersionVerificationManagerL1",
      "ConnectContracts",
      "PolywrapRegistryL2",
      "Registrar",
      "VotingMachine",
      "PackageOwnershipManagerL2",
      "OwnershipBridgeLinkL2",
      "VerificationTreeManager",
      "VersionVerificationManagerL2",
      "VerificationRootBridgeLinkL2",
      "VerificationRootRelayer",
      "ConnectContracts",
    ]);

    const provider = ethers.getDefaultProvider();

    registryL1 = PolywrapRegistry__factory.connect(deploys["PolywrapRegistryL1"].address, provider);
    registryL2 = PolywrapRegistry__factory.connect(deploys["PolywrapRegistryL2"].address, provider);
    registrar = PolywrapRegistrar__factory.connect(deploys["PolywrapRegistrar"].address, provider);
    verificationTreeManager = VerificationTreeManager__factory.connect(
      deploys["VerificationTreeManager"].address, provider
    );
    verificationRootRelayer = VerificationRootRelayer__factory.connect(
      deploys["VerificationRootRelayer"].address, provider
    );
    packageOwnershipManagerL1 = PackageOwnershipManager__factory.connect(
      deploys["PackageOwnershipManagerL1"].address, provider
    );
    packageOwnershipManagerL2 = PackageOwnershipManager__factory.connect(
      deploys["PackageOwnershipManagerL2"].address, provider
    );
    verificationRootBridgeLinkL1 = VerificationRootBridgeLink__factory.connect(
      deploys["VerificationRootBridgeLinkL1"].address, provider
    );
    verificationRootBridgeLinkL2 = VerificationRootBridgeLink__factory.connect(
      deploys["VerificationRootBridgeLinkL2"].address, provider
    );
    ownershipBridgeLinkL1 = OwnershipBridgeLink__factory.connect(deploys["OwnershipBridgeLinkL1"].address, provider);
    ownershipBridgeLinkL2 = OwnershipBridgeLink__factory.connect(deploys["OwnershipBridgeLinkL2"].address, provider);
    versionVerificationManagerL1 = VersionVerificationManager__factory.connect(
      deploys["VersionVerificationManagerL1"].address, provider
    );
    versionVerificationManagerL2 = VersionVerificationManager__factory.connect(
      deploys["VersionVerificationManagerL2"].address, provider
    );
    votingMachine = VotingMachine__factory.connect(deploys["VotingMachine"].address, provider);

    const ensRegistry = ENSRegistry__factory.connect(deploys["EnsRegistryL1"].address, provider);
    const ethRegistrar = TestEthRegistrar__factory.connect(deploys["TestEthRegistrarL1"].address, provider);
    const ensPublicResolver = TestPublicResolver__factory.connect(deploys["TestPublicResolverL1"].address, provider);

    ens = new EnsApi({
      ensRegistryL1: deploys["EnsRegistryL1"].address,
      testEthRegistrarL1: deploys["TestEthRegistrarL1"].address,
      testPublicResolverL1: deploys["TestPublicResolverL1"].address,
    }, provider);

    await ens.registerDomainName(owner, polywrapOwner, testDomain);
    await ens.setPolywrapOwner(
      polywrapOwner,
      testDomain
    );

    await votingMachine.connect(owner).authorizeVerifiers([await verifier1.getAddress()]);
  });

  it("can propose and publish a version", async () => {
    packageOwnershipManagerL1 = packageOwnershipManagerL1.connect(
      polywrapOwner
    );
    registryL1 = registryL1.connect(polywrapOwner);
    registryL2 = registryL2.connect(polywrapOwner);
    versionVerificationManagerL1 = versionVerificationManagerL1.connect(
      polywrapOwner
    );
    versionVerificationManagerL2 = versionVerificationManagerL2.connect(
      polywrapOwner
    );

    packageOwnershipManagerL1.updateOwnership(
      EnsDomain.RegistryBytes32,
      testDomain.node
    );
    packageOwnershipManagerL1.relayOwnership(
      formatBytes32String("l2-chain-name"),
      EnsDomain.RegistryBytes32,
      testDomain.node
    );

    const leaves: string[] = [];

    for (let i = 0; i < 1; i++) {
      const major = 1;
      const minor = 0;
      const patch = i;

      const majorNodeId = solidityKeccak256(
        ["bytes32", "uint256"],
        [testDomain.packageId, major]
      );
      const minorNodeId = solidityKeccak256(
        ["bytes32", "uint256"],
        [majorNodeId, minor]
      );
      const patchNodeId = solidityKeccak256(
        ["bytes32", "uint256"],
        [minorNodeId, patch]
      );

      const nextMinorNodeId = ethers.constants.HashZero;
      const prevMinorNodeId = ethers.constants.HashZero;

      const packageLocation = "test-location";
      const packageLocationHash = solidityKeccak256(
        ["string"],
        [packageLocation]
      );
      const verifiedVersionId = solidityKeccak256(
        ["bytes32", "bytes32"],
        [patchNodeId, packageLocationHash]
      );

      leaves.push(verifiedVersionId);

      registrar = registrar.connect(polywrapOwner);

      const proposeTx = await registrar.proposeVersion(
        testDomain.packageId,
        major,
        minor,
        patch,
        packageLocation
      );

      await proposeTx.wait();

      votingMachine = votingMachine.connect(verifier1);

      const voteTx = await votingMachine.vote([
        {
          patchNodeId: patchNodeId,
          nextMinorNodeId: nextMinorNodeId,
          prevMinorNodeId: prevMinorNodeId,
          approved: true,
        },
      ]);

      await expectEvent(voteTx, "VersionVote", {
        verifier: await verifier1.getAddress(),
        patchNodeId: patchNodeId,
        packageLocationHash: packageLocationHash,
        approved: true,
      });

      const [proof, sides] = computeMerkleProof(leaves, i);

      const l2Tx = await versionVerificationManagerL2.publishVersion(
        testDomain.packageId,
        patchNodeId,
        major,
        minor,
        patch,
        packageLocation,
        proof,
        sides
      );

      await expectEvent(l2Tx, "VersionPublished", {
        packageId: testDomain.packageId,
        major: ethers.BigNumber.from(major),
        minor: ethers.BigNumber.from(minor),
        patch: ethers.BigNumber.from(patch),
        location: packageLocation,
      });

      const versionNodeL2 = await registryL2.versionNodes(patchNodeId);
      expect(versionNodeL2.leaf).to.be.true;
      expect(versionNodeL2.created).to.be.true;
      expect(versionNodeL2.latestSubVersion).to.eql(ethers.BigNumber.from(0));
      expect(versionNodeL2.location).to.equal(packageLocation);

      const l1Tx = await versionVerificationManagerL1.publishVersion(
        testDomain.packageId,
        patchNodeId,
        major,
        minor,
        patch,
        packageLocation,
        proof,
        sides
      );

      await expectEvent(l1Tx, "VersionPublished", {
        packageId: testDomain.packageId,
        major: ethers.BigNumber.from(major),
        minor: ethers.BigNumber.from(minor),
        patch: ethers.BigNumber.from(patch),
        location: packageLocation,
      });

      const versionNodeL1 = await registryL2.versionNodes(patchNodeId);
      expect(versionNodeL1.leaf).to.be.true;
      expect(versionNodeL1.created).to.be.true;
      expect(versionNodeL1.latestSubVersion).to.eql(ethers.BigNumber.from(0));
      expect(versionNodeL1.location).to.equal(packageLocation);
    }
  });
});
