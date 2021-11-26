import { BytesLike, BigNumber } from "ethers";
import {
  zeroPad,
  arrayify,
  formatBytes32String,
  solidityKeccak256,
} from "ethers/lib/utils";
import { parseVersionString } from "./parseVersionString";
import { zeroPadEnd } from "./utils/zeroPadEnd";

export const calculateVersionNodeId = (
  packageId: BytesLike,
  version: string
): BytesLike => {
  const [versionIdentifiers] = parseVersionString(version);

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
