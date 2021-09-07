import { BigNumber, BigNumberish } from "ethers";
import { concat, hexZeroPad, keccak256 } from "ethers/lib/utils";
import { PolywrapVersionRegistry } from "../../typechain";
import { EnsDomain } from "./ens/EnsDomain";

export const getPackageLocation = async (
  registryContract: PolywrapVersionRegistry,
  domain: EnsDomain, majorVersion: BigNumberish | undefined = undefined,
  minorVersion: BigNumberish | undefined = undefined,
  patchVersion: BigNumberish | undefined = undefined
): Promise<string> => {
  let nodeId = domain.packageId;

  if (majorVersion != undefined) {
    nodeId = keccak256(concat([nodeId, hexZeroPad(BigNumber.from(majorVersion).toHexString(), 32)]));
  }

  if (minorVersion != undefined) {
    nodeId = keccak256(concat([nodeId, hexZeroPad(BigNumber.from(minorVersion).toHexString(), 32)]));
  }

  if (patchVersion != undefined) {
    nodeId = keccak256(concat([nodeId, hexZeroPad(BigNumber.from(patchVersion).toHexString(), 32)]));
  }

  return await registryContract.getPackageLocation(nodeId);
};