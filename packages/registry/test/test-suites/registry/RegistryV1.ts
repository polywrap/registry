import hre, { ethers, deployments, getNamedAccounts } from "hardhat";
import chai, { expect } from "chai";
import {
  PolywrapRegistryV1,
  PolywrapRegistryV1__factory,
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
import { BigNumber, ContractTransaction, Signer } from "ethers";
import { computeMerkleProof, EnsDomain } from "@polywrap/registry-core-js";

describe("Voting", () => {
  const testDomain = new EnsDomain("test-domain");

  let registryV1: PolywrapRegistryV1;

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

    const factory = await ethers.getContractFactory("PolywrapRegistryV1");
    const contract = await factory.deploy();

    registryV1 = PolywrapRegistryV1__factory.connect(
      contract.address,
      provider
    );
  });

  it("can propose and publish a version", async () => {
    registryV1 = registryV1.connect(polywrapOwner);

    const { versionId, packageLocation, tx } = await publishVersion(
      registryV1,
      testDomain.packageId,
      1,
      0,
      0,
      "alpha",
      "a"
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

  it("should order versions properly", async () => {
    registryV1 = registryV1.connect(polywrapOwner);

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
    ): Promise<[string, string, string]> => {
      const { versionId: versionId1, patchNodeId } = await publishVersion(
        registryV1,
        testDomain.packageId,
        1,
        0,
        patch,
        preleaseTags[0],
        "test-location"
      );

      const { versionId: versionId2 } = await publishVersion(
        registryV1,
        testDomain.packageId,
        1,
        0,
        patch,
        preleaseTags[1],
        "test-location"
      );

      return [versionId1, versionId2, patchNodeId];
    };

    for (const examples of preleaseTags) {
      const [example1_versionId1, example1_versionId2, example1_patchNodeId] =
        await publishTags(examples);

      let versionNode = await registryV1.resolveToLeaf(example1_patchNodeId);
      expect(versionNode).to.equal(example1_versionId2);

      patch++;

      const [example2_versionId1, example2_versionId2, example2_patchNodeId] =
        await publishTags([examples[1], examples[0]]);

      versionNode = await registryV1.resolveToLeaf(example2_patchNodeId);
      expect(versionNode).to.equal(example2_versionId1);

      patch++;
    }
  });
});

const publishVersion = async (
  registryV1: PolywrapRegistryV1,
  packageId: BytesLike,
  major: number,
  minor: number,
  patch: number,
  pre: string,
  packageLocation: string
): Promise<{
  versionId: string;
  patchNodeId: string;
  packageLocation: string;
  tx: ContractTransaction;
}> => {
  const majorNodeId = solidityKeccak256(
    ["bytes32", "bytes32"],
    [packageId, zeroPad(BigNumber.from(major).toHexString(), 32)]
  );
  const minorNodeId = solidityKeccak256(
    ["bytes32", "bytes32"],
    [majorNodeId, zeroPad(BigNumber.from(minor).toHexString(), 32)]
  );
  const patchNodeId = solidityKeccak256(
    ["bytes32", "bytes32"],
    [minorNodeId, zeroPad(BigNumber.from(patch).toHexString(), 32)]
  );

  const preArray = pre.split(".");
  let nodeId = patchNodeId;
  const versionArray = [
    zeroPad(BigNumber.from(major).toHexString(), 32),
    zeroPad(BigNumber.from(minor).toHexString(), 32),
    zeroPad(BigNumber.from(patch).toHexString(), 32),
  ];

  for (const pre of preArray) {
    let preHex: Uint8Array;

    if (Number.isInteger(+pre)) {
      preHex = zeroPad(
        Uint8Array.from([0, ...arrayify(BigNumber.from(+pre))]),
        32
      );
    } else {
      const utf8Bytes = arrayify(formatBytes32String(pre));

      preHex = zeroPadEnd(
        Uint8Array.from([1, ...utf8Bytes.slice(0, utf8Bytes.length - 1)]),
        32
      );
    }

    nodeId = solidityKeccak256(["bytes32", "bytes32"], [nodeId, preHex]);

    versionArray.push(preHex);
  }

  const version = concat(versionArray);

  const tx = await registryV1.publishVersion(
    packageId,
    version,
    packageLocation
  );

  return {
    versionId: nodeId,
    patchNodeId,
    packageLocation,
    tx,
  };
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
