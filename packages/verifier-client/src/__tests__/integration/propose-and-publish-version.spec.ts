import { Wallet } from "ethers";
import { IPFSHTTPClient } from "ipfs-http-client";
import { buildDependencyContainer } from "../../di/buildDependencyContainer";
import { VerifierClient } from "../../services/VerifierClient";
import { EnsApi } from "./helpers/ens/EnsApi";
import { buildHelpersDependencyExtensions } from "./helpers/buildHelpersDependencyExtensions";
import { down, up } from "./helpers/testEnv";
import { EnsDomain, PackageOwner } from "registry-js";
import { RegistryAuthority } from "registry-test-utils";
import runCommand from "./helpers/runCommand";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("custom-env").env("local");

jest.setTimeout(200000);

const shouldLog = process.env.LOG_TESTS === "true";

describe("Start local chain", () => {
  let verifierClient: VerifierClient;
  let packageOwner: PackageOwner;
  let authority: RegistryAuthority;
  let ensApi: EnsApi;
  let verifierSigner: Wallet;
  let ipfsClient: IPFSHTTPClient;

  const configureDomainForPolywrap = async (domain: EnsDomain) => {
    await ensApi.registerDomainName(packageOwner.signer, domain);
    await ensApi.setPolywrapOwner(packageOwner.signer, domain);
  };

  const authorizeCurrentVerifier = async () => {
    await authority.authorizeVerifiers([await verifierSigner.getAddress()]);
  };

  const publishAndVerifyVersion = async (
    domain: EnsDomain,
    majorNumber: number,
    minorNumber: number,
    patchNumber: number,
    packageLocation: string
  ) => {
    await packageOwner.publishVersion(
      domain,
      packageLocation,
      majorNumber,
      minorNumber,
      patchNumber
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

    expect(versionInfo.location).toEqual(packageLocation);
    expect(resolvedPackageLocation).toEqual(packageLocation);
  };

  beforeAll(async () => {
    const dependencyContainer = buildDependencyContainer(
      buildHelpersDependencyExtensions()
    );
    verifierClient = dependencyContainer.cradle.verifierClient;

    packageOwner = dependencyContainer.cradle.packageOwner;
    authority = dependencyContainer.cradle.authority;
    ensApi = dependencyContainer.cradle.ensApi;
    verifierSigner = dependencyContainer.cradle.verifierSigner;
    ipfsClient = dependencyContainer.cradle.ipfsClient;
  });

  beforeEach(async () => {
    await up(`${__dirname}/../../..`);
    await runCommand(
      "yarn hardhat deploy --network localhost",
      !shouldLog,
      `${__dirname}/../../../../`
    );
  });

  afterEach(async () => {
    await down(`${__dirname}/../../../`);
  });

  it("sanity", async () => {
    const domain = new EnsDomain("test");
    const l2ChainName = "l2-chain-name";
    const polywrapBuildPath = `${__dirname}/test-build`;
    const majorNumber = 1;
    const minorNumber = 0;
    const patchNumber = 0;
    const patchNodeId = packageOwner.calculatePatchNodeId(
      domain,
      majorNumber,
      minorNumber,
      patchNumber
    );

    await configureDomainForPolywrap(domain);

    const packageLocation = await publishToIPFS(polywrapBuildPath, ipfsClient);

    await packageOwner.updateOwnership(domain);
    await packageOwner.relayOwnership(domain, l2ChainName);

    await packageOwner.proposeVersion(
      domain,
      majorNumber,
      minorNumber,
      patchNumber,
      packageLocation
    );

    await authorizeCurrentVerifier();
    await verifierClient.queryAndVerifyVersions();

    const votingResult = await packageOwner.waitForVotingEnd(
      domain,
      majorNumber,
      minorNumber,
      patchNumber,
      packageLocation
    );
    expect(votingResult.patchNodeId).toEqual(patchNodeId);
    expect(votingResult.verified).toEqual(true);

    await publishAndVerifyVersion(
      domain,
      majorNumber,
      minorNumber,
      patchNumber,
      packageLocation
    );
  });
});
