import hre, { ethers, deployments, getNamedAccounts } from "hardhat";
import chai, { expect } from "chai";
import {
  PolywrapRegistryV1,
  PolywrapRegistryV1__factory,
  RegistryV1,
  VersionResolverV1,
  VersionResolverV1__factory,
} from "../../../typechain";
import { EnsApi } from "../../helpers/ens/EnsApi";
import { PolywrapRegistrar } from "../../../typechain/PolywrapRegistrar";
import {
  arrayify,
  BytesLike,
  concat,
  formatBytes32String,
  keccak256,
  solidityKeccak256,
  zeroPad,
} from "ethers/lib/utils";
import { VerificationRootBridgeLinkMock } from "../../../typechain/VerificationRootBridgeLinkMock";
import { OwnershipBridgeLinkMock } from "../../../typechain/OwnershipBridgeLinkMock";
import { expectEvent } from "../../helpers";
import { BigNumber, ContractTransaction, Signer, version } from "ethers";
import { computeMerkleProof, EnsDomain } from "@polywrap/registry-core-js";

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
      versionId: versionId,
      location: packageLocation,
    });

    const versionNodeL1 = await registryV1.versionNodes(versionId);
    expect(versionNodeL1.leaf).to.be.true;
    expect(versionNodeL1.created).to.be.true;
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
      versionId: versionId,
      location: packageLocation,
    });

    const versionNodeL1 = await registryV1.versionNodes(versionId);
    expect(versionNodeL1.leaf).to.be.true;
    expect(versionNodeL1.created).to.be.true;
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
      versionId: versionId,
      location: packageLocation,
    });

    const versionNodeL1 = await registryV1.versionNodes(versionId);
    expect(versionNodeL1.leaf).to.be.true;
    expect(versionNodeL1.created).to.be.true;
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
      versionId: versionId,
      location: packageLocation,
    });

    const versionNodeL1 = await registryV1.versionNodes(versionId);
    expect(versionNodeL1.leaf).to.be.true;
    expect(versionNodeL1.created).to.be.true;
    expect(versionNodeL1.location).to.equal(packageLocation);
  });

  it("can publish development prerelease versions", async () => {
    const { versionId, packageLocation, tx } = await publishVersion(
      registryV1,
      testDomain.packageId,
      "0.0.0-alpha",
      "some-location"
    );

    await expectEvent(tx, "VersionPublished", {
      packageId: testDomain.packageId,
      versionId: versionId,
      location: packageLocation,
    });

    const versionNodeL1 = await registryV1.versionNodes(versionId);
    expect(versionNodeL1.leaf).to.be.true;
    expect(versionNodeL1.created).to.be.true;
    expect(versionNodeL1.location).to.equal(packageLocation);
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

      let versionNode = await resolver.resolveToLatestPrereleaseNode(
        example1_patchNodeId
      );
      expect(versionNode).to.equal(example1_versionId2);

      patch++;

      const [example2_versionId1, example2_versionId2, example2_patchNodeId] =
        await publishTags([examples[1], examples[0]]);

      versionNode = await resolver.resolveToLatestPrereleaseNode(
        example2_patchNodeId
      );
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

  const versionNode = await resolver.resolveToLatestReleaseNode(
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

  const versionNode = await resolver.resolveToLatestPrereleaseNode(
    toVersionNodeId(packageId, searchVersion)
  );

  expect(versionNode).to.equal(toVersionNodeId(packageId, expectedVersion));
};

const publishVersionWithPromise = async (
  registryV1: PolywrapRegistryV1,
  packageId: BytesLike,
  version: string,
  packageLocation: string
): Promise<{
  versionId: BytesLike;
  patchNodeId: BytesLike;
  packageLocation: string;
  txPromise: Promise<ContractTransaction>;
}> => {
  const versionIdentifiers = parseVersionString(version);

  let nodeId = packageId;
  const versionArray = [];
  let patchNodeId: BytesLike = packageId;

  for (let i = 0; i < versionIdentifiers.length; i++) {
    const identifier = versionIdentifiers[i];

    let hex: Uint8Array;

    if (Number.isInteger(+identifier)) {
      hex = zeroPad(
        Uint8Array.from([0, ...arrayify(BigNumber.from(+identifier))]),
        32
      );
    } else {
      const utf8Bytes = arrayify(formatBytes32String(identifier));

      hex = zeroPadEnd(
        Uint8Array.from([1, ...utf8Bytes.slice(0, utf8Bytes.length - 1)]),
        32
      );
    }

    nodeId = solidityKeccak256(["bytes32", "bytes32"], [nodeId, hex]);

    if (i == 2) {
      patchNodeId = nodeId;
    }

    versionArray.push(hex);
  }

  const versionBytes = concat(versionArray);

  const txPromise = registryV1.publishVersion(
    packageId,
    versionBytes,
    packageLocation
  );

  return {
    versionId: nodeId,
    patchNodeId,
    packageLocation,
    txPromise,
  };
};

const publishVersion = async (
  registryV1: PolywrapRegistryV1,
  packageId: BytesLike,
  version: string,
  packageLocation: string
): Promise<{
  versionId: BytesLike;
  patchNodeId: BytesLike;
  packageLocation: string;
  tx: ContractTransaction;
}> => {
  const result = await publishVersionWithPromise(
    registryV1,
    packageId,
    version,
    packageLocation
  );

  const tx = await result.txPromise;

  return {
    ...result,
    tx,
  };
};

const publishVersions = async (
  registryV1: PolywrapRegistryV1,
  packageId: BytesLike,
  versions: string[],
  packageLocation: string
): Promise<void> => {
  for (const version of versions) {
    const result = await publishVersionWithPromise(
      registryV1,
      packageId,
      version,
      packageLocation
    );

    await result.txPromise;
  }
};

const toVersionNodeId = (packageId: BytesLike, version: string): BytesLike => {
  const versionIdentifiers = parseVersionString(version);

  let nodeId = packageId;

  for (let i = 0; i < versionIdentifiers.length; i++) {
    const identifier = versionIdentifiers[i];

    let hex: Uint8Array;

    if (Number.isInteger(+identifier)) {
      hex = zeroPad(
        Uint8Array.from([0, ...arrayify(BigNumber.from(+identifier))]),
        32
      );
    } else {
      const utf8Bytes = arrayify(formatBytes32String(identifier));

      hex = zeroPadEnd(
        Uint8Array.from([1, ...utf8Bytes.slice(0, utf8Bytes.length - 1)]),
        32
      );
    }

    nodeId = solidityKeccak256(["bytes32", "bytes32"], [nodeId, hex]);
  }

  return nodeId;
};

//Pads the end of the array with zeroes
const zeroPadEnd = (value: BytesLike, length: number): Uint8Array => {
  value = ethers.utils.arrayify(value);

  if (value.length > length) {
    throw Error("Value out of range");
  }

  const result = new Uint8Array(length);
  result.set(value, 0);

  return result;
};
const parseVersionString = (version: string) => {
  const dashSplit = version.split("-");
  const releaseIdentifiers = dashSplit[0].split(".");

  const identifiers = releaseIdentifiers.concat(
    dashSplit.length > 1 ? dashSplit.slice(1).join("-").split(".") : []
  );

  return identifiers;
};