import { BytesLike, BigNumber } from "ethers";
import { zeroPad, solidityKeccak256 } from "ethers/lib/utils";
import { encodeAlphanumericIdentifier } from "./encodeAlphanumericIdentifier";
import { parseVersionString } from "./parseVersionString";

export const calculateVersionNodeId = (
  packageId: BytesLike,
  version: string
): BytesLike => {
  const versionIdentifiers = parseVersionString(version).identifiers;

  let nodeId = packageId;

  for (let i = 0; i < versionIdentifiers.length; i++) {
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
