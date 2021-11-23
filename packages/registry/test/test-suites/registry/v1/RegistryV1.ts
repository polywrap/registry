import hre, { ethers, deployments, getNamedAccounts } from "hardhat";
import chai, { expect } from "chai";
import {
  PolywrapRegistryV1,
  PolywrapRegistryV1__factory,
  VersionResolverV1,
  VersionResolverV1__factory,
} from "../../../../typechain";
import {
  arrayify,
  BytesLike,
  concat,
  formatBytes32String,
  solidityKeccak256,
  zeroPad,
} from "ethers/lib/utils";
import {
  expectEvent,
  publishVersion,
  publishVersions,
  publishVersionWithPromise,
  toVersionNodeId,
} from "../../../helpers";
import { BigNumber, ContractTransaction, Signer } from "ethers";
import { EnsDomain } from "@polywrap/registry-core-js";

describe("Publishing versions", () => {
  const testDomain = new EnsDomain("test-domain");

  let registryV1: PolywrapRegistryV1;
  let resolver: VersionResolverV1;

  let owner: Signer;
  let domainOwner: Signer;
  let polywrapOwner: Signer;
  let verifier1: Signer;
  let randomAcc: Signer;

  before(async () => {
    const [_owner, _domainOwner, _polywrapOwner, _verifier1, _randomAcc] =
      await ethers.getSigners();
    owner = _owner;
    domainOwner = _domainOwner;
    polywrapOwner = _polywrapOwner;
    verifier1 = _verifier1;
    randomAcc = _randomAcc;
  });

  beforeEach(async () => {
    const provider = ethers.getDefaultProvider();

    const registryFactory = await ethers.getContractFactory(
      "PolywrapRegistryV1"
    );
    const registryContract = await registryFactory.deploy();

    registryV1 = PolywrapRegistryV1__factory.connect(
      registryContract.address,
      provider
    );

    const resolverFactory = await ethers.getContractFactory(
      "VersionResolverV1"
    );
    const resolverContract = await resolverFactory.deploy(
      registryContract.address
    );

    resolver = VersionResolverV1__factory.connect(
      resolverContract.address,
      provider
    );

    const resolverFactory = await ethers.getContractFactory(
      "VersionResolverV1"
    );
    const resolverContract = await resolverFactory.deploy(
      registryContract.address
    );

    resolver = VersionResolverV1__factory.connect(
      resolverContract.address,
      provider
    );

    registryV1 = registryV1.connect(polywrapOwner);
    resolver = resolver.connect(polywrapOwner);
  });

  it("can propose and publish a development version", async () => {
    const { versionId, packageLocation, tx } = await publishVersion(
      registryV1,
      testDomain.packageId,
      "0.1.0",
      "some-location"
    );

    await expectEvent(tx, "VersionPublished", {
      packageId: testDomain.packageId,
      versionNodeId: versionId,
      location: packageLocation,
    });

    const versionNodeL1 = await registryV1.version(versionId);
    expect(versionNodeL1.leaf).to.be.true;
    expect(versionNodeL1.exists).to.be.true;
    expect(versionNodeL1.location).to.equal(packageLocation);
  });

  it("can publish production release versions", async () => {
    const { versionId, packageLocation, tx } = await publishVersion(
      registryV1,
      testDomain.packageId,
      "1.0.0",
      "some-location"
    );

    await expectEvent(tx, "VersionPublished", {
      packageId: testDomain.packageId,
      versionNodeId: versionId,
      location: packageLocation,
    });

    const versionNodeL1 = await registryV1.version(versionId);
    expect(versionNodeL1.leaf).to.be.true;
    expect(versionNodeL1.exists).to.be.true;
    expect(versionNodeL1.location).to.equal(packageLocation);
  });

  it("can publish development release versions", async () => {
    const { versionId, packageLocation, tx } = await publishVersion(
      registryV1,
      testDomain.packageId,
      "0.0.1",
      "some-location"
    );

    await expectEvent(tx, "VersionPublished", {
      packageId: testDomain.packageId,
      versionNodeId: versionId,
      location: packageLocation,
    });

    const versionNodeL1 = await registryV1.version(versionId);
    expect(versionNodeL1.leaf).to.be.true;
    expect(versionNodeL1.exists).to.be.true;
    expect(versionNodeL1.location).to.equal(packageLocation);
  });

  it("can publish production prerelease versions", async () => {
    const { versionId, packageLocation, tx } = await publishVersion(
      registryV1,
      testDomain.packageId,
      "1.0.0-alpha",
      "some-location"
    );

    await expectEvent(tx, "VersionPublished", {
      packageId: testDomain.packageId,
      versionNodeId: versionId,
      location: packageLocation,
    });

    const versionNodeL1 = await registryV1.version(versionId);
    expect(versionNodeL1.leaf).to.be.true;
    expect(versionNodeL1.exists).to.be.true;
    expect(versionNodeL1.location).to.equal(packageLocation);
  });

  it("can publish development prerelease versions", async () => {
    const { versionId, packageLocation, tx } = await publishVersion(
      registryV1,
      testDomain.packageId,
      "0.0.1-alpha",
      "some-location"
    );

    await expectEvent(tx, "VersionPublished", {
      packageId: testDomain.packageId,
      versionNodeId: versionId,
      location: packageLocation,
    });

    const versionNodeL1 = await registryV1.version(versionId);
    expect(versionNodeL1.leaf).to.be.true;
    expect(versionNodeL1.exists).to.be.true;
    expect(versionNodeL1.location).to.equal(packageLocation);
  });

  it("can publish version with build metadata", async () => {
    const buildMetadata = "test-metadata";

    const { versionId, packageLocation, tx } = await publishVersion(
      registryV1,
      testDomain.packageId,
      `1.0.0+${buildMetadata}`,
      "some-location"
    );

    await expectEvent(tx, "VersionPublished", {
      packageId: testDomain.packageId,
      versionNodeId: versionId,
      location: packageLocation,
    });

    const versionNodeL1 = await registryV1.version(versionId);
    expect(versionNodeL1.leaf).to.be.true;
    expect(versionNodeL1.exists).to.be.true;
    expect(versionNodeL1.location).to.equal(packageLocation);
    expect(versionNodeL1.buildMetadata).to.equal(
      formatBytes32String(buildMetadata)
    );
  });

  it("forbids publishing non [0-9A-Za-z-] strings for identifiers", async () => {
    let result = await publishVersionWithPromise(
      registryV1,
      testDomain.packageId,
      `1.0.0-test_prerelease`,
      "some-location"
    );

    await expect(result.txPromise).to.revertedWith(
      "reverted with custom error 'InvalidIdentifier()'"
    );

    result = await publishVersionWithPromise(
      registryV1,
      testDomain.packageId,
      `1.0.0-test.`,
      "some-location"
    );

    await expect(result.txPromise).to.revertedWith(
      "reverted with custom error 'InvalidIdentifier()'"
    );

    result = await publishVersionWithPromise(
      registryV1,
      testDomain.packageId,
      `1.0.0-test prerelease`,
      "some-location"
    );

    await expect(result.txPromise).to.revertedWith(
      "reverted with custom error 'InvalidIdentifier()'"
    );
  });

  it("forbids publishing non [0-9A-Za-z-] strings for build metadata", async () => {
    let result = await publishVersionWithPromise(
      registryV1,
      testDomain.packageId,
      `1.0.0+test_metadata`,
      "some-location"
    );

    await expect(result.txPromise).to.revertedWith(
      "reverted with custom error 'InvalidBuildMetadata()'"
    );

    result = await publishVersionWithPromise(
      registryV1,
      testDomain.packageId,
      `1.0.0+test metadata`,
      "some-location"
    );

    await expect(result.txPromise).to.revertedWith(
      "reverted with custom error 'InvalidBuildMetadata()'"
    );

    result = await publishVersionWithPromise(
      registryV1,
      testDomain.packageId,
      `1.0.0+test.`,
      "some-location"
    );

    await expect(result.txPromise).to.revertedWith(
      "reverted with custom error 'InvalidBuildMetadata()'"
    );
  });

  it("forbids publishing a version without major, minor and patch identifiers", async () => {
    let result = await publishVersionWithPromise(
      registryV1,
      testDomain.packageId,
      "1.0",
      "some-location"
    );

    await expect(result.txPromise).to.revertedWith(
      "reverted with custom error 'VersionNotFullLength()'"
    );

    result = await publishVersionWithPromise(
      registryV1,
      testDomain.packageId,
      "1",
      "some-location"
    );

    await expect(result.txPromise).to.revertedWith(
      "reverted with custom error 'VersionNotFullLength()'"
    );
  });

  it("forbids publishing a non numeric release identifier", async () => {
    let result = await publishVersionWithPromise(
      registryV1,
      testDomain.packageId,
      "1.0.alpha",
      "some-location"
    );

    await expect(result.txPromise).to.revertedWith(
      "reverted with custom error 'ReleaseIdentifierMustBeNumeric()'"
    );

    result = await publishVersionWithPromise(
      registryV1,
      testDomain.packageId,
      "1.alpha.0",
      "some-location"
    );

    await expect(result.txPromise).to.revertedWith(
      "reverted with custom error 'ReleaseIdentifierMustBeNumeric()'"
    );

    result = await publishVersionWithPromise(
      registryV1,
      testDomain.packageId,
      "alpha.0.0",
      "some-location"
    );

    await expect(result.txPromise).to.revertedWith(
      "reverted with custom error 'ReleaseIdentifierMustBeNumeric()'"
    );
  });

  it("forbids publishing the same version more than once", async () => {
    let result = await publishVersionWithPromise(
      registryV1,
      testDomain.packageId,
      "1.0.0",
      "some-location-1"
    );

    result = await publishVersionWithPromise(
      registryV1,
      testDomain.packageId,
      "1.0.0",
      "some-location-2"
    );

    await expect(result.txPromise).to.revertedWith(
      "reverted with custom error 'VersionAlreadyPublished()'"
    );
  });

  it("can resolve to release version", async () => {
    await testReleaseResolution(
      registryV1,
      resolver,
      testDomain.packageId,
      ["1.0.0", "1.0.1-alpha", "1.0.1", "1.0.2-alpha"],
      "1.0",
      "1.0.1"
    );
  });

  it("can resolve to prerelease version", async () => {
    await testPrereleaseResolution(
      registryV1,
      resolver,
      testDomain.packageId,
      ["1.0.0", "1.0.1", "1.0.2-alpha", "1.0.1-alpha"],
      "1.0",
      "1.0.2-alpha"
    );
  });

  it("prerelease should have lower precedence than release", async () => {
    await testPrereleaseResolution(
      registryV1,
      resolver,
      testDomain.packageId,
      ["1.0.0", "1.0.1-alpha", "1.0.1"],
      "1.0",
      "1.0.1"
    );
  });

  it("larger set of pre-release fields has a higher precedence than a smaller set", async () => {
    await testPrereleaseResolution(
      registryV1,
      resolver,
      testDomain.packageId,
      ["1.0.0", "1.0.1-alpha", "1.0.1-alpha.1"],
      "1.0",
      "1.0.1-alpha.1"
    );
  });

  it("requires patch to be reset when incrementing minor for release versions", async () => {
    await publishVersion(
      registryV1,
      testDomain.packageId,
      "1.0.0",
      "some-location"
    );

    //The rule applies even if there's a greater minor version already published
    await publishVersion(
      registryV1,
      testDomain.packageId,
      "1.2.0",
      "some-location"
    );

    const result = await publishVersionWithPromise(
      registryV1,
      testDomain.packageId,
      "1.1.1",
      "some-location"
    );

    await expect(result.txPromise).to.revertedWith(
      "reverted with custom error 'IdentifierNotReset()'"
    );
  });

  it("requires minor to be reset when incrementing major for release versions", async () => {
    await publishVersion(
      registryV1,
      testDomain.packageId,
      "1.0.0",
      "some-location"
    );

    //The rule applies even if there's a greater major version already published
    await publishVersion(
      registryV1,
      testDomain.packageId,
      "3.0.0",
      "some-location"
    );

    let result = await publishVersionWithPromise(
      registryV1,
      testDomain.packageId,
      "2.1.0",
      "some-location"
    );

    await expect(result.txPromise).to.revertedWith(
      "reverted with custom error 'IdentifierNotReset()'"
    );

    result = await publishVersionWithPromise(
      registryV1,
      testDomain.packageId,
      "2.0.1",
      "some-location"
    );

    await expect(result.txPromise).to.revertedWith(
      "reverted with custom error 'IdentifierNotReset()'"
    );
  });

  it("requires patch to be reset when incrementing minor for prerelease versions", async () => {
    await publishVersion(
      registryV1,
      testDomain.packageId,
      "1.0.0-alpha",
      "some-location"
    );

    //The rule applies even if there's a greater minor version already published
    await publishVersion(
      registryV1,
      testDomain.packageId,
      "1.2.0.alpha",
      "some-location"
    );

    const result = await publishVersionWithPromise(
      registryV1,
      testDomain.packageId,
      "1.1.1-alpha",
      "some-location"
    );

    await expect(result.txPromise).to.revertedWith(
      "reverted with custom error 'IdentifierNotReset()'"
    );
  });

  it("requires minor to be reset when incrementing major for prerelease versions", async () => {
    await publishVersion(
      registryV1,
      testDomain.packageId,
      "1.0.0-alpha",
      "some-location"
    );

    //The rule applies even if there's a greater major version already published
    await publishVersion(
      registryV1,
      testDomain.packageId,
      "3.0.0-alpha",
      "some-location"
    );

    let result = await publishVersionWithPromise(
      registryV1,
      testDomain.packageId,
      "2.1.0-alpha",
      "some-location"
    );

    await expect(result.txPromise).to.revertedWith(
      "reverted with custom error 'IdentifierNotReset()'"
    );

    result = await publishVersionWithPromise(
      registryV1,
      testDomain.packageId,
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
    ): Promise<[BytesLike, BytesLike, BytesLike]> => {
      const { versionId: versionId1, patchNodeId } = await publishVersion(
        registryV1,
        testDomain.packageId,
        `1.0.${patch}-${preleaseTags[0]}`,
        "test-location"
      );

      const { versionId: versionId2 } = await publishVersion(
        registryV1,
        testDomain.packageId,
        `1.0.${patch}-${preleaseTags[1]}`,
        "test-location"
      );

      return [versionId1, versionId2, patchNodeId];
    };

    for (const examples of preleaseTags) {
      const [example1_versionId1, example1_versionId2, example1_patchNodeId] =
        await publishTags(examples);

      let versionNode = await resolver.latestPrereleaseNode(
        example1_patchNodeId
      );
      expect(versionNode).to.equal(example1_versionId2);

      patch++;

      const [example2_versionId1, example2_versionId2, example2_patchNodeId] =
        await publishTags([examples[1], examples[0]]);

      versionNode = await resolver.latestPrereleaseNode(example2_patchNodeId);
      expect(versionNode).to.equal(example2_versionId1);

      patch++;
    }
  });
});

const testReleaseResolution = async (
  registryV1: PolywrapRegistryV1,
  resolver: VersionResolverV1,
  packageId: BytesLike,
  versions: string[],
  searchVersion: string,
  expectedVersion: string
): Promise<void> => {
  await publishVersions(registryV1, packageId, versions, "some-location");

  const versionNode = await resolver.latestReleaseNode(
    toVersionNodeId(packageId, searchVersion)
  );

  expect(versionNode).to.equal(toVersionNodeId(packageId, expectedVersion));
};

const testPrereleaseResolution = async (
  registryV1: PolywrapRegistryV1,
  resolver: VersionResolverV1,
  packageId: BytesLike,
  versions: string[],
  searchVersion: string,
  expectedVersion: string
): Promise<void> => {
  await publishVersions(registryV1, packageId, versions, "some-location");

  const versionNode = await resolver.latestPrereleaseNode(
    toVersionNodeId(packageId, searchVersion)
  );

  expect(versionNode).to.equal(toVersionNodeId(packageId, expectedVersion));
};
