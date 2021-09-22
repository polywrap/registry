import { buildDependencyContainer } from "./di/buildDependencyContainer";
import express from "express";
import cors from "cors";
import { Tracer } from "@polywrap/registry-js";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("custom-env").env(process.env.ENV);

Tracer.enableTracing("verifier-client");

const dependencyContainer = buildDependencyContainer();
const {
  verifierClient,
  apiServerConfig,
  webUiServerConfig,
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
    res.send({
      status: "running",
    });
  });

  app.listen(apiServerConfig.port, () => {
    console.log(
      `API is running on port ${apiServerConfig.port}. Check status here: http://localhost:${apiServerConfig.port}/info`
    );
  });

  await verifierClient.run();
}
