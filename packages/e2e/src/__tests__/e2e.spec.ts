import { Wallet } from "@ethersproject/wallet";
import {
  EnsDomain,
  PackageOwner,
  RegistryAuthority,
} from "@polywrap/registry-js";
import {
  EnsApi,
  publishToIPFS,
  runCommand,
} from "@polywrap/registry-test-utils";
import { IPFSHTTPClient } from "ipfs-http-client";
import { IpfsConfig } from "../config/IpfsConfig";
import { buildDependencyContainer } from "../di/buildDependencyContainer";
import { buildHelpersDependencyExtensions } from "./helpers/buildHelpersDependencyExtensions";
import { down, up } from "./helpers/testEnv";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("custom-env").env(process.env.ENV || "local");

jest.setTimeout(2000000);

const shouldLog = process.env.LOG_TESTS === "true";

const publishAndVerifyVersion = async (
  packageOwner: PackageOwner,
  domain: EnsDomain,
  majorNumber: number,
  minorNumber: number,
  patchNumber: number,
  packageLocation: string
) => {
  const proof = await packageOwner.fetchAndCalculateVerificationProof(
    domain,
    majorNumber,
    minorNumber,
    patchNumber
  );

  await packageOwner.publishVersion(
    domain,
    packageLocation,
    majorNumber,
    minorNumber,
    patchNumber,
    proof
  );

  const versionInfo = await packageOwner.getVersionNodeInfo(
    domain,
    majorNumber,
    minorNumber,
    patchNumber
  );
  const resolvedPackageLocation = await packageOwner.resolveToPackageLocation(
    domain,
    majorNumber,
    minorNumber,
    patchNumber
  );
  expect(versionInfo.location).toBe(packageLocation);
  expect(resolvedPackageLocation).toBe(packageLocation);
};

describe("e2e", () => {
  let packageOwner: PackageOwner;
  let registryAuthority: RegistryAuthority;
  let ensApi: EnsApi;
  let ipfsConfig: IpfsConfig;
  let ipfsClient: IPFSHTTPClient;
  let verifierSigner: Wallet;

  beforeAll(async () => {
    const dependencyContainer = buildDependencyContainer(
      buildHelpersDependencyExtensions({
        consoleLogLevel: "debug",
        fileLogLevel: "debug",
        logFileName: "test_verifier_client.log",
      })
    );

    packageOwner = dependencyContainer.cradle.packageOwner;
    registryAuthority = dependencyContainer.cradle.registryAuthority;
    ensApi = dependencyContainer.cradle.ensApi;
    ipfsConfig = dependencyContainer.cradle.ipfsConfig;
    ipfsClient = dependencyContainer.cradle.ipfsClient;
    verifierSigner = dependencyContainer.cradle.verifierSigner;
  });

  beforeEach(async () => {
    // await up(`${__dirname}/../../`, ipfsConfig.ipfsProvider);
    await runCommand(
      "yarn hardhat deploy --network localhost",
      !shouldLog,
      `${__dirname}/../../../registry`
    );
  });

  afterEach(async () => {
    // await down(`${__dirname}/../../`);
  });

  it("sanity", async () => {
    console.log("Hello 1");
    const domain = new EnsDomain("test");
    const l1ChainName = "l1-chain-name";
    const l2ChainName = "l2-chain-name";
    const polywrapBuildPath = `${__dirname}/test-build`;
    const majorNumber = 1;
    const minorNumber = 0;
    const patchNumber = 0;
    console.log("Hello 2");
    const patchNodeId = packageOwner.calculatePatchNodeId(
      domain,
      majorNumber,
      minorNumber,
      patchNumber
    );
    console.log("Hello 3");

    const verifierAddresses = await verifierSigner.getAddress();
    const tx = await registryAuthority.votingMachine.authorizeVerifiers([
      verifierAddresses,
    ]);
    const receipt = await tx.wait();
    console.log(receipt);

    await registryAuthority.authorizeVerifiers([
      await verifierSigner.getAddress(),
    ]);
    console.log("Hello 4");

    await ensApi.registerDomainName(packageOwner.signer, domain);
    await ensApi.setPolywrapOwner(packageOwner.signer, domain);
    console.log("Hello 5");
    const packageLocation = await publishToIPFS(polywrapBuildPath, ipfsClient);

    shouldLog && console.log("Package location", packageLocation);

    await packageOwner.updateOwnership(domain);
    await packageOwner.relayOwnership(domain, l2ChainName);
    console.log("Hello 6");
    await packageOwner.proposeVersion(
      domain,
      majorNumber,
      minorNumber,
      patchNumber,
      packageLocation
    );
    console.log("Hello 7");

    const votingResult = await packageOwner.waitForVotingEnd(
      domain,
      majorNumber,
      minorNumber,
      patchNumber,
      packageLocation
    );
    console.log("Hello 8");

    expect(votingResult.patchNodeId).toBe(patchNodeId);
    expect(votingResult.verified).toBe(true);

    await publishAndVerifyVersion(
      packageOwner,
      domain,
      majorNumber,
      minorNumber,
      patchNumber,
      packageLocation
    );
    console.log("Hello 9");

    const versionInfo = await packageOwner.getVersionNodeInfo(
      domain,
      majorNumber,
      minorNumber,
      patchNumber
    );
    console.log("Hello 10");
    const resolvedPackageLocation = await packageOwner.resolveToPackageLocation(
      domain,
      majorNumber,
      minorNumber,
      patchNumber
    );

    expect(versionInfo.location).toBe(packageLocation);
    expect(resolvedPackageLocation).toBe(packageLocation);
  });
});
