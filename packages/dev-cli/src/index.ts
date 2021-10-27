import {
  EnsDomain,
  RegistryAuthority,
  RegistryContracts,
} from "@polywrap/registry-js";
import { ethers } from "ethers";
import { program } from "commander";
import { configureDomainForPolywrap } from "./configureDomainForPolywrap";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("custom-env").env(process.env.ENV);

const provider = ethers.providers.getDefaultProvider(
  process.env.ETHEREUM_RPC_URL
);
const VERIFIER_PRIVATE_KEY = process.env.VERIFIER_PRIVATE_KEY;

const registryContracts = RegistryContracts.fromDefaultLocalhost(
  provider,
  "xdai"
);

program
  .command("configure-ens")
  .requiredOption("-d, --domain --domain-name <string>", "ENS domain name")
  .requiredOption("-do, --domain-owner <string>", "Private key of domain owner")
  .option(
    "-eo, --ens-owner <string>",
    "Private key of ens owner [Optional - if not passed domainOwner will be used as default]"
  )
  .action(async (options) => {
    const ensOwner = new ethers.Wallet(
      options.ensOwner ?? options.domainOwner,
      provider
    );
    const domainOwner = new ethers.Wallet(options.domainOwner, provider);
    const domain = new EnsDomain(options.domain);
    await configureDomainForPolywrap(ensOwner, domainOwner, domain, provider);
    console.log(`ENS: ${options.domain} configured successfully.`);
  });

program
  .command("authorize-verifier")
  .option(
    "-v, --verifier <string>",
    "Private key of verifier [Optional - if not passed default private key from env will be used]"
  )
  .action(async (options) => {
    const verifierPrivateKey = options.verifier ?? VERIFIER_PRIVATE_KEY;
    const verifierSigner = new ethers.Wallet(verifierPrivateKey, provider);
    const authority = new RegistryAuthority(
      verifierSigner,
      registryContracts.votingMachine.address
    );
    await authority.authorizeVerifiers([await verifierSigner.getAddress()]);
    console.log("Verifier Authorized successfully.");
  });

program.parse(process.argv);
