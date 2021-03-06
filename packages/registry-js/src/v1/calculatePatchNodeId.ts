import { BytesLike, BigNumber } from "ethers";
import { solidityKeccak256, zeroPad } from "ethers/lib/utils";
import { parseVersionString } from ".";
import { encodeAlphanumericIdentifier } from "./encodeAlphanumericIdentifier";

export const calculatePatchNodeId = (
  packageId: BytesLike,
  version: string
): BytesLike => {
  const versionIdentifiers = parseVersionString(version).identifiers;

  let nodeId = packageId;

  for (let i = 1; i < versionIdentifiers.length + 1; i++) {
    const identifier = versionIdentifiers[i - 1];

    let encodedIdentifier = BigNumber.from(0);

    if (Number.isInteger(+identifier) && identifier !== "") {
      encodedIdentifier = BigNumber.from(+identifier);
    } else {
      encodedIdentifier = encodeAlphanumericIdentifier(identifier);
    }

    nodeId = solidityKeccak256(
      ["bytes32", "bytes32"],
      [nodeId, zeroPad(encodedIdentifier.toHexString(), 32)]
    );

    if (i == 2) {
      return nodeId;
    } else if (i > 2) {
      throw Error("Could not calculate patch node id");
    }
  }

  throw Error("Could not calculate patch node id");
};
