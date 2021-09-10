import path from "path";
import { exec, ExecException } from "child_process";
import { EnsDomain } from "./ens/EnsDomain";
import { ethers } from "ethers";
import { create } from "ipfs-http-client";
import { RegistryAuthority } from "./RegistryAuthority";
import { PackageOwner } from "./PackageOwner";
import { EnsApi } from "./ens/EnsApi";
import { VotingMachine__factory } from "../../typechain";
import * as VotingMachine from "../../deployments/localhost/VotingMachine.json";
import { VerifierStateInfo } from "../../VerifierStateInfo";
import { buildDependencyContainer } from "../../di/buildDependencyContainer";
import { VerifierClient } from "../../services/VerifierClient";
import runCommand from "./runCommand";
import { up, down } from "./testEnv";
import { publishToIPFS } from "./ipfs-publisher";

require("custom-env").env("local");

jest.setTimeout(200000);

const shouldLog = process.env.LOG_TESTS === "true";

describe("Start local chain", () => {
  let verifierClient: VerifierClient;

  beforeAll(async () => {
    const dependencyContainer = buildDependencyContainer();
    verifierClient = dependencyContainer.cradle.verifierClient;
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

    const provider = ethers.providers.getDefaultProvider(
      process.env.PROVIDER_NETWORK
    );
    const ipfsClient = create({
      url: process.env.IPFS_URI,
    });

    const packageOwner = new PackageOwner(
      provider,
      process.env.PACKAGE_OWNER_PRIVATE_KEY!
    );
    const authority = new RegistryAuthority(
      provider,
      process.env.REGISTRY_AUTHORITY_PRIVATE_KEY!
    );
    const ens = new EnsApi();

    const verifierSigner = new ethers.Wallet(
      process.env.VERIFIER_PRIVATE_KEY!,
      provider
    );
    await authority.authorizeVerifiers([await verifierSigner.getAddress()]);

    await ens.init(provider);

    await ens.registerDomainName(packageOwner.signer, domain);
    await ens.setPolywrapOwner(packageOwner.signer, domain);

    const cid = await publishToIPFS(`${__dirname}/test-build`, ipfsClient);

    const packageLocation = `ipfs/${cid}`;

    await packageOwner.updateOwnership(domain);
    await packageOwner.relayOwnership(domain, l2ChainName);

    await packageOwner.proposeVersion(domain, packageLocation, 1, 0, 0);

    await verifierClient.queryAndVerifyVersions();

    await packageOwner.waitForVotingEnd(domain, packageLocation, 1, 0, 0);
    await packageOwner.publishVersion(domain, packageLocation, 1, 0, 0);
  });
});
