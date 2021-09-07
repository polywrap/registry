import path from "path";
import { exec, ExecException } from "child_process";
import * as dotenv from "dotenv";
import { PackageOwner } from "../PackageOwner";
import { EnsApi } from "../ens/EnsApi";
import { EnsDomain } from "../ens/EnsDomain";
import { ethers } from "ethers";
import { RegistryAuthority } from "../RegistryAuthority";
import { create, IPFSHTTPClient } from "ipfs-http-client";

dotenv.config();

jest.setTimeout(200000);

const shouldLog = process.env.LOG_TESTS === "true";

describe("e2e", () => {
  beforeAll(async () => {
  });

  beforeEach(async () => {
    await runCommand('yarn docker:full -d', !shouldLog, `${__dirname}/../../../verifier-client`);
    await runCommand('yarn hardhat deploy --network localhost', !shouldLog, `${__dirname}/../../../`);
  });

  afterEach(async () => {
    await runCommand('docker-compose down', !shouldLog, `${__dirname}/../../../verifier-client`);
  });

  it("sanity", async () => {
    const domain = new EnsDomain("test");
    const l1ChainName = "l1-chain-name";
    const l2ChainName = "l2-chain-name";

    var provider = ethers.providers.getDefaultProvider(process.env.PROVIDER_NETWORK);
    const ipfsClient = create({
      url: `http://localhost:${process.env.IPFS_PORT}/api/v0`
    });

    console.log(`http://localhost:${process.env.IPFS_PORT}/api/v0`);

    var packageOwner = new PackageOwner(provider, process.env.PACKAGE_OWNER_PRIVATE_KEY!);
    var authority = new RegistryAuthority(provider, process.env.REGISTRY_AUTHORITY_PRIVATE_KEY!);
    var ens = new EnsApi();

    const verifierSigner = new ethers.Wallet(process.env.VERIFIER_PRIVATE_KEY!, provider);
    await authority.authorizeVerifiers([await verifierSigner.getAddress()]);

    await ens.init(provider);

    await ens.registerDomainName(packageOwner.signer, domain);
    await ens.setPolywrapOwner(packageOwner.signer, domain);
    const { cid } = await ipfsClient.add(`type Object {
      """
      comment
      """
        prop1: Int!
      }
      `);

    const packageLocation = cid.toString();

    await packageOwner.updateOwnership(domain);
    await packageOwner.relayOwnership(domain, l2ChainName);

    await packageOwner.proposeVersion(domain, packageLocation, 1, 0, 0);
    await packageOwner.waitForVotingEnd(domain, packageLocation, 1, 0, 0);
    await packageOwner.publishVersion(domain, packageLocation, 1, 0, 0);
  });
});

async function runCommand(command: string, quiet: boolean, cwd: string) {

  if (!quiet) {
    console.log(`> ${command}`)
  }

  return new Promise((resolve, reject) => {
    const callback = (err: ExecException | null, stdout: string, stderr: string) => {
      if (err) {
        console.error(err)
        reject(err)
      } else {
        if (!quiet) {
          // the *entire* stdout and stderr (buffered)
          console.log(`stdout: ${stdout}`)
          console.log(`stderr: ${stderr}`)
        }

        resolve(null);
      }
    }

    exec(command, { cwd: cwd }, callback)
  })
}
