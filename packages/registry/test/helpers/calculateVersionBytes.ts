import { BytesLike, BigNumber } from "ethers";
import { zeroPad, concat } from "ethers/lib/utils";
import { encodeAlphanumericIdentifier } from "./encodeAlphanumericIdentifier";
import { parseVersionString } from "./parseVersionString";

export const calculateVersionBytes = (version: string): Uint8Array => {
  const versionIdentifiers = parseVersionString(version).identifiers;

  const versionArray: BytesLike[] = [
    BigNumber.from(versionIdentifiers.length).toHexString(),
  ];

  let hex = BigNumber.from(0);

  for (let i = 1; i < versionIdentifiers.length + 1; i++) {
    const identifier = versionIdentifiers[i - 1];

    let encodedIdentifier = BigNumber.from(0);

    if (Number.isInteger(+identifier) && identifier !== "") {
      encodedIdentifier = BigNumber.from(+identifier);
    } else {
      encodedIdentifier = encodeAlphanumericIdentifier(identifier);
    }

    if (i % 2 == 1) {
      hex = encodedIdentifier.shl(121);
    } else {
      hex = hex.or(encodedIdentifier);

      versionArray.push(zeroPad(hex.toHexString(), 32));
    }
  }

  if (versionIdentifiers.length % 2 == 1) {
    versionArray.push(zeroPad(hex.toHexString(), 32));
  }

  const versionBytes = concat(versionArray);
  return versionBytes;
};
