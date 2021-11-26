import { BytesLike, BigNumber } from "ethers";
import {
  zeroPad,
  arrayify,
  formatBytes32String,
  concat,
} from "ethers/lib/utils";
import { zeroPadEnd } from "./utils/zeroPadEnd";

export const calculateVersionBytes = (
  packageId: BytesLike,
  versionIdentifiers: string[]
): Uint8Array => {
  const versionArray = [];

  for (let i = 0; i < versionIdentifiers.length; i++) {
    const identifier = versionIdentifiers[i];

    let hex: Uint8Array;

    if (Number.isInteger(+identifier) && identifier !== "") {
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

    versionArray.push(hex);
  }

  return concat(versionArray);
};
