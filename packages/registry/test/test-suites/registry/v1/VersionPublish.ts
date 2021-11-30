import hre, { ethers, deployments } from "hardhat";
import chai, { expect } from "chai";
import {
  PolywrapRegistryV1,
  PolywrapRegistryV1__factory,
  VersionResolverV1,
} from "../../../../typechain-types";
import { BytesLike, formatBytes32String } from "ethers/lib/utils";
import { Signer } from "ethers";
import { EnsApi } from "../../../helpers/ens/EnsApi";
import { buildPolywrapPackage } from "../../../helpers/buildPolywrapPackage";
import { PolywrapPackage } from "../../../helpers/PolywrapPackage";
import { EnsDomain } from "../../../helpers/EnsDomain";
import { expectEvent } from "../../../helpers";
import { publishVersion } from "../../../helpers/publishVersion";
import { publishVersions } from "../../../helpers/publishVersions";
import { publishVersionWithPromise } from "../../../helpers/publishVersionWithPromise";
import { calculateVersionNodeId } from "../../../helpers/calculateVersionNodeId";

describe("Publishing versions", () => {
  let testPackage: PolywrapPackage;

  let registry: PolywrapRegistryV1;
  let resolver: VersionResolverV1;

  let ens: EnsApi;

  let owner: Signer;
  let domainOwner: Signer;
  let polywrapOwner: Signer;
  let organizationController: Signer;
  let packageController: Signer;
  let randomAcc: Signer;

  before(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0];
    domainOwner = signers[1];
    polywrapOwner = signers[2];
    organizationController = signers[3];
    packageController = signers[4];
    randomAcc = signers[5];
  });

  beforeEach(async () => {
    const deploys = await deployments.fixture(["ens", "v1"]);

    const provider = ethers.getDefaultProvider();

    registry = PolywrapRegistryV1__factory.connect(
      deploys["PolywrapRegistryV1"].address,
      provider
    );

    ens = new EnsApi(
      {
        ensRegistryL1: deploys["EnsRegistryL1"].address,
        testEthRegistrarL1: deploys["TestEthRegistrarL1"].address,
        testPublicResolverL1: deploys["TestPublicResolverL1"].address,
      },
      provider
    );

    const testDomain = new EnsDomain("test-domain");
    testPackage = buildPolywrapPackage(testDomain, "test-package");

    await ens.registerDomainName(owner, domainOwner, testDomain);

    registry = registry.connect(domainOwner);

    resolver = registry;

    let tx = await registry.claimOrganizationOwnership(
      testDomain.registryBytes32,
      testDomain.node,
      await polywrapOwner.getAddress()
    );

    await tx.wait();

    registry = registry.connect(polywrapOwner);

    tx = await registry.setOrganizationController(
      testDomain.organizationId,
      await organizationController.getAddress()
    );

    await tx.wait();

    registry = registry.connect(organizationController);

    tx = await registry.registerPackage(
      testPackage.organizationId,
      formatBytes32String(testPackage.packageName),
      await polywrapOwner.getAddress(),
      await packageController.getAddress()
    );

    await tx.wait();

    registry = registry.connect(packageController);
  });

  it("can publish a development version", async () => {
    const { versionId, packageLocation, tx } = await publishVersion(
      registry,
      testPackage.packageId,
      "0.1.0",
      "some-location"
    );

    await expectEvent(tx, "VersionPublished", {
      packageId: testPackage.packageId,
      versionNodeId: versionId,
      location: packageLocation,
    });

    const versionNode = await registry.version(versionId);
    expect(versionNode.exists).to.be.true;
    expect(versionNode.leaf).to.be.true;
    expect(versionNode.location).to.equal(packageLocation);

    expect(await registry.versionExists(versionId)).to.be.true;
    expect(await registry.versionLocation(versionId)).to.equal(packageLocation);

    const versionMetadata = await registry.versionMetadata(versionId);
    expect(versionMetadata.exists).to.be.true;
    expect(versionMetadata.leaf).to.be.true;
    expect(versionMetadata.latestPrereleaseVersion).to.be.equal(0);
    expect(versionMetadata.latestReleaseVersion).to.be.equal(0);
  });

  it("can publish production release versions", async () => {
    const { versionId, packageLocation, tx } = await publishVersion(
      registry,
      testPackage.packageId,
      "1.0.0",
      "some-location"
    );

    await expectEvent(tx, "VersionPublished", {
      packageId: testPackage.packageId,
      versionNodeId: versionId,
      location: packageLocation,
    });

    const versionNode = await registry.version(versionId);
    expect(versionNode.leaf).to.be.true;
    expect(versionNode.exists).to.be.true;
    expect(versionNode.location).to.equal(packageLocation);
  });

  it("can publish development release versions", async () => {
    const { versionId, packageLocation, tx } = await publishVersion(
      registry,
      testPackage.packageId,
      "0.0.1",
      "some-location"
    );

    await expectEvent(tx, "VersionPublished", {
      packageId: testPackage.packageId,
      versionNodeId: versionId,
      location: packageLocation,
    });

    const versionNode = await registry.version(versionId);
    expect(versionNode.leaf).to.be.true;
    expect(versionNode.exists).to.be.true;
    expect(versionNode.location).to.equal(packageLocation);
  });

  it("can publish production prerelease versions", async () => {
    const { versionId, packageLocation, tx } = await publishVersion(
      registry,
      testPackage.packageId,
      "1.0.0-alpha",
      "some-location"
    );

    await expectEvent(tx, "VersionPublished", {
      packageId: testPackage.packageId,
      versionNodeId: versionId,
      location: packageLocation,
    });

    const versionNode = await registry.version(versionId);
    expect(versionNode.leaf).to.be.true;
    expect(versionNode.exists).to.be.true;
    expect(versionNode.location).to.equal(packageLocation);
  });

  it("can publish development prerelease versions", async () => {
    const { versionId, packageLocation, tx } = await publishVersion(
      registry,
      testPackage.packageId,
      "0.0.1-alpha",
      "some-location"
    );

    await expectEvent(tx, "VersionPublished", {
      packageId: testPackage.packageId,
      versionNodeId: versionId,
      location: packageLocation,
    });

    const versionNode = await registry.version(versionId);
    expect(versionNode.leaf).to.be.true;
    expect(versionNode.exists).to.be.true;
    expect(versionNode.location).to.equal(packageLocation);
  });

  it("can publish version with build metadata", async () => {
    const buildMetadata = "test-metadata";

    const { versionId, packageLocation, tx } = await publishVersion(
      registry,
      testPackage.packageId,
      `1.0.0+${buildMetadata}`,
      "some-location"
    );

    await expectEvent(tx, "VersionPublished", {
      packageId: testPackage.packageId,
      versionNodeId: versionId,
      location: packageLocation,
    });

    const versionNode = await registry.version(versionId);
    expect(versionNode.leaf).to.be.true;
    expect(versionNode.exists).to.be.true;
    expect(versionNode.location).to.equal(packageLocation);
    expect(versionNode.buildMetadata).to.equal(
      formatBytes32String(buildMetadata)
    );
  });

  it("forbids publishing non [0-9A-Za-z-] strings for identifiers", async () => {
    let result = await publishVersionWithPromise(
      registry,
      testPackage.packageId,
      `1.0.0-test_prerelease`,
      "some-location"
    );

    await expect(result.txPromise).to.revertedWith(
      "reverted with custom error 'InvalidIdentifier()'"
    );

    result = await publishVersionWithPromise(
      registry,
      testPackage.packageId,
      `1.0.0-test.`,
      "some-location"
    );

    await expect(result.txPromise).to.revertedWith(
      "reverted with custom error 'InvalidIdentifier()'"
    );

    result = await publishVersionWithPromise(
      registry,
      testPackage.packageId,
      `1.0.0-test prerelease`,
      "some-location"
    );

    await expect(result.txPromise).to.revertedWith(
      "reverted with custom error 'InvalidIdentifier()'"
    );
  });

  it("forbids publishing non [0-9A-Za-z-] strings for build metadata", async () => {
    let result = await publishVersionWithPromise(
      registry,
      testPackage.packageId,
      `1.0.0+test_metadata`,
      "some-location"
    );

    await expect(result.txPromise).to.revertedWith(
      "reverted with custom error 'InvalidBuildMetadata()'"
    );

    result = await publishVersionWithPromise(
      registry,
      testPackage.packageId,
      `1.0.0+test metadata`,
      "some-location"
    );

    await expect(result.txPromise).to.revertedWith(
      "reverted with custom error 'InvalidBuildMetadata()'"
    );

    result = await publishVersionWithPromise(
      registry,
      testPackage.packageId,
      `1.0.0+test.`,
      "some-location"
    );

    await expect(result.txPromise).to.revertedWith(
      "reverted with custom error 'InvalidBuildMetadata()'"
    );
  });

  it("forbids publishing a version without major, minor and patch identifiers", async () => {
    let result = await publishVersionWithPromise(
      registry,
      testPackage.packageId,
      "1.0",
      "some-location"
    );

    await expect(result.txPromise).to.revertedWith(
      "reverted with custom error 'VersionNotFullLength()'"
    );

    result = await publishVersionWithPromise(
      registry,
      testPackage.packageId,
      "1",
      "some-location"
    );

    await expect(result.txPromise).to.revertedWith(
      "reverted with custom error 'VersionNotFullLength()'"
    );
  });

  it("forbids publishing a non numeric release identifier", async () => {
    let result = await publishVersionWithPromise(
      registry,
      testPackage.packageId,
      "1.0.alpha",
      "some-location"
    );

    await expect(result.txPromise).to.revertedWith(
      "reverted with custom error 'ReleaseIdentifierMustBeNumeric()'"
    );

    result = await publishVersionWithPromise(
      registry,
      testPackage.packageId,
      "1.alpha.0",
      "some-location"
    );

    await expect(result.txPromise).to.revertedWith(
      "reverted with custom error 'ReleaseIdentifierMustBeNumeric()'"
    );

    result = await publishVersionWithPromise(
      registry,
      testPackage.packageId,
      "alpha.0.0",
      "some-location"
    );

    await expect(result.txPromise).to.revertedWith(
      "reverted with custom error 'ReleaseIdentifierMustBeNumeric()'"
    );
  });

  it("forbids publishing the same version more than once", async () => {
    let result = await publishVersionWithPromise(
      registry,
      testPackage.packageId,
      "1.0.0",
      "some-location-1"
    );

    result = await publishVersionWithPromise(
      registry,
      testPackage.packageId,
      "1.0.0",
      "some-location-2"
    );

    await expect(result.txPromise).to.revertedWith(
      "reverted with custom error 'VersionAlreadyPublished()'"
    );
  });

  it("can resolve to release version", async () => {
    await testReleaseResolution(
      registry,
      resolver,
      testPackage.packageId,
      ["1.0.0", "1.0.1-alpha", "1.0.1", "1.0.2-alpha"],
      "1.0",
      "1.0.1"
    );
  });

  it("can resolve to prerelease version", async () => {
    await testPrereleaseResolution(
      registry,
      resolver,
      testPackage.packageId,
      ["1.0.0", "1.0.1", "1.0.2-alpha", "1.0.1-alpha"],
      "1.0",
      "1.0.2-alpha"
    );
  });

  it("prerelease should have lower precedence than release", async () => {
    await testPrereleaseResolution(
      registry,
      resolver,
      testPackage.packageId,
      ["1.0.0", "1.0.1-alpha", "1.0.1"],
      "1.0",
      "1.0.1"
    );
  });

  it("larger set of pre-release fields has a higher precedence than a smaller set", async () => {
    await testPrereleaseResolution(
      registry,
      resolver,
      testPackage.packageId,
      ["1.0.0", "1.0.1-alpha", "1.0.1-alpha.1"],
      "1.0",
      "1.0.1-alpha.1"
    );
  });

  it("requires patch to be reset when incrementing minor for release versions", async () => {
    await publishVersion(
      registry,
      testPackage.packageId,
      "1.0.0",
      "some-location"
    );

    //The rule applies even if there's a greater minor version already published
    await publishVersion(
      registry,
      testPackage.packageId,
      "1.2.0",
      "some-location"
    );

    const result = await publishVersionWithPromise(
      registry,
      testPackage.packageId,
      "1.1.1",
      "some-location"
    );

    await expect(result.txPromise).to.revertedWith(
      "reverted with custom error 'IdentifierNotReset()'"
    );
  });

  it("requires minor to be reset when incrementing major for release versions", async () => {
    await publishVersion(
      registry,
      testPackage.packageId,
      "1.0.0",
      "some-location"
    );

    //The rule applies even if there's a greater major version already published
    await publishVersion(
      registry,
      testPackage.packageId,
      "3.0.0",
      "some-location"
    );

    let result = await publishVersionWithPromise(
      registry,
      testPackage.packageId,
      "2.1.0",
      "some-location"
    );

    await expect(result.txPromise).to.revertedWith(
      "reverted with custom error 'IdentifierNotReset()'"
    );

    result = await publishVersionWithPromise(
      registry,
      testPackage.packageId,
      "2.0.1",
      "some-location"
    );

    await expect(result.txPromise).to.revertedWith(
      "reverted with custom error 'IdentifierNotReset()'"
    );
  });

  it("requires patch to be reset when incrementing minor for prerelease versions", async () => {
    await publishVersion(
      registry,
      testPackage.packageId,
      "1.0.0-alpha",
      "some-location"
    );

    //The rule applies even if there's a greater minor version already published
    await publishVersion(
      registry,
      testPackage.packageId,
      "1.2.0.alpha",
      "some-location"
    );

    const result = await publishVersionWithPromise(
      registry,
      testPackage.packageId,
      "1.1.1-alpha",
      "some-location"
    );

    await expect(result.txPromise).to.revertedWith(
      "reverted with custom error 'IdentifierNotReset()'"
    );
  });

  it("requires minor to be reset when incrementing major for prerelease versions", async () => {
    await publishVersion(
      registry,
      testPackage.packageId,
      "1.0.0-alpha",
      "some-location"
    );

    //The rule applies even if there's a greater major version already published
    await publishVersion(
      registry,
      testPackage.packageId,
      "3.0.0-alpha",
      "some-location"
    );

    let result = await publishVersionWithPromise(
      registry,
      testPackage.packageId,
      "2.1.0-alpha",
      "some-location"
    );

    await expect(result.txPromise).to.revertedWith(
      "reverted with custom error 'IdentifierNotReset()'"
    );

    result = await publishVersionWithPromise(
      registry,
      testPackage.packageId,
      "2.0.1-alpha",
      "some-location"
    );

    await expect(result.txPromise).to.revertedWith(
      "reverted with custom error 'IdentifierNotReset()'"
    );
  });

  it("should order prerelease versions properly", async () => {
    const preleaseTags = [
      ["1", "2"],
      ["2", "11"],
      ["alpha", "beta"],
      ["1", "a"],
      ["a11", "a2"],
      ["11a", "2a"],
      ["2", "1a"],
      ["1a", "2a"],
      ["alpha", "alpha1"],
      ["alpha-1", "alpha-2"],
      ["alpha-12", "alpha-2"],
      ["alpha.1", "alpha.2"],
      ["alpha.2", "beta.1"],
      ["alpha.2", "alpha.1a"],
      ["alpha", "alpha.beta"],
      ["alpha.2", "alpha.beta.1"],
      ["alpha.2.1", "alpha.beta"],
    ];

    let patch = 0;

    const publishTags = async (
      preleaseTags: string[]
    ): Promise<[BytesLike, BytesLike, BytesLike | undefined]> => {
      const { versionId: versionId1, patchNodeId } = await publishVersion(
        registry,
        testPackage.packageId,
        `1.0.${patch}-${preleaseTags[0]}`,
        "test-location"
      );

      const { versionId: versionId2 } = await publishVersion(
        registry,
        testPackage.packageId,
        `1.0.${patch}-${preleaseTags[1]}`,
        "test-location"
      );

      return [versionId1, versionId2, patchNodeId];
    };

    for (const examples of preleaseTags) {
      const [example1_versionId1, example1_versionId2, example1_patchNodeId] =
        await publishTags(examples);

      if (!example1_patchNodeId) {
        throw new Error("patchNodeId is undefined");
      }

      let versionNode = await resolver.latestPrereleaseNode(
        example1_patchNodeId
      );
      expect(versionNode).to.equal(example1_versionId2);

      patch++;

      const [example2_versionId1, example2_versionId2, example2_patchNodeId] =
        await publishTags([examples[1], examples[0]]);

      if (!example2_patchNodeId) {
        throw new Error("patchNodeId is undefined");
      }

      versionNode = await resolver.latestPrereleaseNode(example2_patchNodeId);
      expect(versionNode).to.equal(example2_versionId1);

      patch++;
    }
  });
});

const testReleaseResolution = async (
  registry: PolywrapRegistryV1,
  resolver: VersionResolverV1,
  packageId: BytesLike,
  versions: string[],
  searchVersion: string,
  expectedVersion: string
): Promise<void> => {
  await publishVersions(registry, packageId, versions, "some-location");

  const versionNode = await resolver.latestReleaseNode(
    calculateVersionNodeId(packageId, searchVersion)
  );

  expect(versionNode).to.equal(
    calculateVersionNodeId(packageId, expectedVersion)
  );
};

const testPrereleaseResolution = async (
  registry: PolywrapRegistryV1,
  resolver: VersionResolverV1,
  packageId: BytesLike,
  versions: string[],
  searchVersion: string,
  expectedVersion: string
): Promise<void> => {
  await publishVersions(registry, packageId, versions, "some-location");

  const versionNode = await resolver.latestPrereleaseNode(
    calculateVersionNodeId(packageId, searchVersion)
  );

  expect(versionNode).to.equal(
    calculateVersionNodeId(packageId, expectedVersion)
  );
};
