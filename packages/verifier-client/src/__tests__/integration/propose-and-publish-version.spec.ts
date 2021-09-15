import { Wallet } from "ethers";
import { IPFSHTTPClient } from "ipfs-http-client";
import { buildDependencyContainer } from "../../di/buildDependencyContainer";
import { VerifierClient } from "../../services/VerifierClient";
import { EnsDomain } from "registry-js";
import { EnsApi } from "registry-test-utils";
import { RegistryAuthority } from "registry-test-utils";
import { buildHelpersDependencyExtensions } from "registry-test-utils";

import { down, up } from "registry-test-utils";
import runCommand from "./helpers/runCommand";
import publishToIPFS from "./helpers/publishToIPFS";
import { Web3ApiClient } from "@web3api/client-js";
import { EthereumProvider } from "@web3api/ethereum-plugin-js";
import { setupWeb3ApiClient } from "../../web3Api/setupClient";
import { JsonRpcProvider } from "@web3api/client-js/build/pluginConfigs/Ethereum";
import { PackageOwner } from "registry-js";

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

  it("start", async () => {
    const domain = new EnsDomain("test");
    const l1ChainName = "l1-chain-name";
    const l2ChainName = "l2-chain-name";

    await authority.authorizeVerifiers([await verifierSigner.getAddress()]);

    await ensApi.registerDomainName(packageOwner.signer, domain);
    await ensApi.setPolywrapOwner(packageOwner.signer, domain);

    const cid = await publishToIPFS(`${__dirname}/test-build`, ipfsClient);

    const packageLocation = cid;
    console.log("packageLocation", cid);

    await packageOwner.updateOwnership(domain);
    await packageOwner.relayOwnership(domain, l2ChainName);

    await packageOwner.proposeVersion(domain, packageLocation, 1, 0, 0);

    await verifierClient.queryAndVerifyVersions();

    await packageOwner.waitForVotingEnd(domain, packageLocation, 1, 0, 0);
    await packageOwner.publishVersion(domain, packageLocation, 1, 0, 0);
  });
});
