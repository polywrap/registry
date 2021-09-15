import * as dotenv from "dotenv";
import { EnsApi } from "./helpers/ens/EnsApi";
import { RegistryAuthority } from "registry-test-utils";
import { IPFSHTTPClient } from "ipfs-http-client";
import { EnsDomain, PackageOwner } from "registry-js";
import { runCommand } from "registry-test-utils";
import { buildDependencyContainer } from "../di/buildDependencyContainer";
import { buildHelpersDependencyExtensions } from "./helpers/buildHelpersDependencyExtensions";
import { Wallet } from "@ethersproject/wallet";

require("custom-env").env();

jest.setTimeout(200000);

const shouldLog = process.env.LOG_TESTS === "true";

describe("e2e", () => {
  let packageOwner: PackageOwner;
  let authority: RegistryAuthority;
  let ensApi: EnsApi;
  let ipfsClient: IPFSHTTPClient;
  let verifierSigner: Wallet;

  beforeAll(async () => {
    const dependencyContainer = buildDependencyContainer(
      buildHelpersDependencyExtensions()
    );

    packageOwner = dependencyContainer.cradle.packageOwner;
    authority = dependencyContainer.cradle.authority;
    ensApi = dependencyContainer.cradle.ensApi;
    ipfsClient = dependencyContainer.cradle.ipfsClient;
    verifierSigner = dependencyContainer.cradle.verifierSigner;
  });

  beforeEach(async () => {
    await runCommand(
      "yarn docker:full -d",
      !shouldLog,
      `${__dirname}/../../../verifier-client`
    );
    await runCommand(
      "yarn hardhat deploy --network localhost",
      !shouldLog,
      `${__dirname}/../../../`
    );
  });

  afterEach(async () => {
    await runCommand(
      "docker-compose down",
      !shouldLog,
      `${__dirname}/../../../verifier-client`
    );
  });

  it("sanity", async () => {
    const domain = new EnsDomain("test");
    const l1ChainName = "l1-chain-name";
    const l2ChainName = "l2-chain-name";

    await authority.authorizeVerifiers([await verifierSigner.getAddress()]);

    await ensApi.registerDomainName(packageOwner.signer, domain);
    await ensApi.setPolywrapOwner(packageOwner.signer, domain);
    const { cid } = await ipfsClient.add(`type Object {
      """
      comment
      """
        prop1: Int!
      }
      `);

    const packageLocation = cid.toString();
    shouldLog && console.log("Package location", packageLocation);

    await packageOwner.updateOwnership(domain);
    await packageOwner.relayOwnership(domain, l2ChainName);

    await packageOwner.proposeVersion(domain, 1, 0, 0, packageLocation);

    await packageOwner.waitForVotingEnd(domain, 1, 0, 0, packageLocation);
    await packageOwner.publishVersion(domain, packageLocation, 1, 0, 0);
  });
});
