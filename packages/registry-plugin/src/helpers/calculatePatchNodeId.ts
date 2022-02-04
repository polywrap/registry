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

  if (versionIdentifiers.length < 3) {
    throw new Error("Version string is too short");
  }

  for (let i = 0; i < 3; i++) {
    const identifier = versionIdentifiers[i];

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
  }

  return nodeId;
};
