import { buildDependencyContainer } from "./di/buildDependencyContainer";
import express from "express";
import cors from "cors";
import { RegistryAuthority, Tracer } from "@polywrap/registry-js";
import fs from "fs";
import { EnsDomain } from "@polywrap/registry-core-js";
import { ethers } from "ethers";
import { configureDomainForPolywrap } from "./helpers/configureDomainForPolywrap";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("custom-env").env(process.env.ENV);

Tracer.enableTracing("verifier-client");

const dependencyContainer = buildDependencyContainer();
const {
  verifierClient,
  verifierSigner,
  registryContracts,
  apiServerConfig,
  webUiServerConfig,
  ethersProvider,
  logger,
} = dependencyContainer.cradle;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const argv = require("minimist")(process.argv.slice(2));

if (argv._ && argv._.length !== 0) {
  const command = argv._[0];

  (async () => {
    switch (command) {
      case "run":
        await run();
        break;
      default:
        console.log(`Command not found: ${command}.`);
        break;
    }
  })();
} else {
  console.log("No command specified.");
}

async function run() {
  const app = express();

  const corsOptions = {
    origin: webUiServerConfig.uri,
  };

  app.use(cors(corsOptions));

  app.get("/info", (_, res) => {
    logger.debug(`API request: info`);
    res.send({
      status: "running",
    });
  });

  app.get("/dev/configureEnsDomain", async (req, res) => {
    logger.debug(`API request: configureEnsDomain`);
    try {
      await configureDomainForPolywrap(
        new ethers.Wallet(req.query.ensOwner as string, ethersProvider),
        new ethers.Wallet(req.query.owner as string, ethersProvider),
        new EnsDomain(req.query.domain as string),
        ethersProvider
      );
      res.send("Success");
    } catch (ex) {
      logger.debug(`API request failure: configureEnsDomain`);
      res.send(ex);
    }
  });

  app.get("/dev/authorizeVerifier", async (req, res) => {
    logger.debug(`API request: authorizeVerifier`);
    try {
      const authority = new RegistryAuthority(
        verifierSigner,
        registryContracts.votingMachine.address
      );

      await authority.authorizeVerifiers([await verifierSigner.getAddress()]);
      res.send("Success");
    } catch (ex) {
      logger.debug(`API request failure: authorizeVerifier`);
      res.send(ex);
    }
  });

  app.get("/logs", async (_, res) => {
    logger.debug(`API request: logs`);
    const text = await fs.promises.readFile(
      `${__dirname}/../verifier_client.log`,
      "utf-8"
    );
    res.send({
      data: text
        .split("\n")
        .filter((line) => line)
        .map((line) => {
          const [timestamp, level, message] = line.split(" - ");
          return {
            timestamp: timestamp,
            level: level,
            message: message,
          };
        }),
    });
  });

  app.listen(apiServerConfig.port, () => {
    logger.debug(
      `API is running on port ${apiServerConfig.port}. Check status here: http://localhost:${apiServerConfig.port}/info`
    );
  });

  await verifierClient.run();
}
