import hre from "hardhat";
import { expect } from "chai";
import {
  BaseContract,
  BigNumber,
  BytesLike,
  Contract,
  ContractTransaction,
  ethers,
  providers,
} from "ethers";
import { eventNames } from "process";
import { DeploymentsExtension } from "hardhat-deploy/dist/types";
import {
  zeroPad,
  arrayify,
  formatBytes32String,
  solidityKeccak256,
  concat,
} from "ethers/lib/utils";
import { PolywrapRegistryV1 } from "../../typechain";

export const getSubnodeHash = (
  parentHash: string,
  childHash: string
): string => {
  const calculatedHash = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ["bytes32", "bytes32"],
      [ethers.utils.arrayify(parentHash), ethers.utils.arrayify(childHash)]
    )
  );

  return calculatedHash;
};

export const hashString = (name: string): string => {
  const hash = ethers.utils.id(name);
  return hash;
};

/* eslint-disable @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any */
export function filterLogsWithTopics(
  logs: providers.Log[],
  topic: any,
  contractAddress: string
): ethers.providers.Log[] {
  return logs
    .filter((log) => log.topics.includes(topic))
    .filter(
      (log) =>
        log.address &&
        log.address.toLowerCase() === contractAddress.toLowerCase()
    );
}
/* eslint-enable @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any */

export async function getEvents(
  tx: ContractTransaction,
  event: string,
  contract: Contract
): Promise<ethers.utils.LogDescription[]> {
  const receipt = await tx.wait();
  const topic = contract.interface.getEventTopic(event);
  const logs = filterLogsWithTopics(receipt.logs, topic, contract.address);
  const events = logs.map((e) => contract.interface.parseLog(e));

  return events;
}

export async function getEvent(
  tx: ContractTransaction,
  event: string,
  contract: Contract
): Promise<ethers.utils.LogDescription> {
  const events = await getEvents(tx, event, contract);
  const firstEvent = events[0];
  return firstEvent;
}

export const expectEvent = async (
  tx: ContractTransaction,
  eventName: string,
  args: Record<string, any>
) => {
  const receivedArgs = await getEventArgs(tx, eventName);

  for (const arg of Object.keys(args)) {
    expect(receivedArgs[arg]).to.eql(args[arg], `${arg}`);
  }
};

export const getEventArgs = async (
  tx: ContractTransaction,
  eventName: string
): Promise<Record<string, any>> => {
  const result = await tx.wait();

  const event = result.events?.find((x) => x.event === eventName);

  const receivedArgs = event?.args;

  if (!receivedArgs) {
    throw `Received undefined arguments: ${eventName}`;
  }

  return receivedArgs;
};

export const publishVersionWithPromise = async (
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
  const [versionIdentifiers, buildMetadata] = parseVersionString(version);

  let nodeId = packageId;
  const versionArray = [];
  let patchNodeId: BytesLike = packageId;

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
    formatBytes32String(buildMetadata),
    packageLocation
  );

  return {
    versionId: nodeId,
    patchNodeId,
    packageLocation,
    txPromise,
  };
};

export const publishVersion = async (
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

  await tx.wait();

  return {
    ...result,
    tx,
  };
};

export const publishVersions = async (
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

export const toVersionNodeId = (
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

const parseVersionString = (
  version: string
): [identifiers: string[], buildMetadata: string] => {
  const metadataSplit = version.split("+");
  const dashSplit = metadataSplit[0].split("-");
  const releaseIdentifiers = dashSplit[0].split(".");

  const identifiers = releaseIdentifiers.concat(
    dashSplit.length > 1 ? dashSplit.slice(1).join("-").split(".") : []
  );

  return [identifiers, metadataSplit.length > 1 ? metadataSplit[1] : ""];
};
