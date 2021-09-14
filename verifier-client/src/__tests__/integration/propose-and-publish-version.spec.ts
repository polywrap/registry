import { exec, ExecException } from "child_process";
import { ethers, Wallet } from "ethers";
import { create, IPFSHTTPClient } from "ipfs-http-client";
import { buildDependencyContainer } from "../../di/buildDependencyContainer";
import { VerifierClient } from "../../services/VerifierClient";
import { EnsDomain } from "../../EnsDomain";
import { EnsApi } from "./helpers/ens/EnsApi";
import { PackageOwner } from "./helpers/PackageOwner";
import { RegistryAuthority } from "./helpers/RegistryAuthority";
import { buildHelpersDependencyExtensions } from "./helpers/buildHelpersDependencyExtensions";
import { down, up } from "./helpers/testEnv";
import publishToIPFS from "./helpers/publishToIPFS";
import { Web3ApiClient } from "@web3api/client-js";
import { EthereumProvider } from "@web3api/ethereum-plugin-js";
import { setupWeb3ApiClient } from "../../web3Api/setupClient";
import { JsonRpcProvider } from "@web3api/client-js/build/pluginConfigs/Ethereum";
import runCommand from "./helpers/runCommand";
import { VotingService } from "../../services/VotingService";

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
  let polywrapClient: Web3ApiClient;
  let ethersProv: JsonRpcProvider;
  let votingService: VotingService;

  const configureDomainForPolywrap = async (domain: EnsDomain) => {
    await ensApi.init();
    await ensApi.registerDomainName(packageOwner.signer, domain);
    await ensApi.setPolywrapOwner(packageOwner.signer, domain);
  };

  const authorizeCurrentVerifier = async () => {
    await authority.authorizeVerifiers([await verifierSigner.getAddress()]);
  };

  const publishAndVerifyVersion = async (domain: EnsDomain, majorNumber: number, minorNumber: number, patchNumber: number, packageLocation: string) => {
    await packageOwner.publishVersion(domain, packageLocation, majorNumber, minorNumber, patchNumber);

    const versionInfo = await packageOwner.getVersionNodeInfo(domain, majorNumber, minorNumber, patchNumber);
    const resolvedPackageLocation = await packageOwner.resolveToPackageLocation(domain, majorNumber, minorNumber, patchNumber);

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
    polywrapClient = dependencyContainer.cradle.polywrapClient;
    ethersProv = dependencyContainer.cradle.ethersProvider;
    votingService = dependencyContainer.cradle.votingService;
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
    const patchNodeId = packageOwner.calculatePatchNodeId(domain, majorNumber, minorNumber, patchNumber);

    await configureDomainForPolywrap(domain);

    const packageLocation = await publishToIPFS(polywrapBuildPath, ipfsClient);

    await packageOwner.updateOwnership(domain);
    await packageOwner.relayOwnership(domain, l2ChainName);

    await packageOwner.proposeVersion(domain, majorNumber, minorNumber, patchNumber, packageLocation);

    await authorizeCurrentVerifier();
    await verifierClient.queryAndVerifyVersions();

    const votingResult = await packageOwner.waitForVotingEnd(domain, majorNumber, minorNumber, patchNumber, packageLocation);
    expect(votingResult.patchNodeId).toEqual(patchNodeId);
    expect(votingResult.verified).toEqual(true);

    await publishAndVerifyVersion(domain, majorNumber, minorNumber, patchNumber, packageLocation);
  });
});
