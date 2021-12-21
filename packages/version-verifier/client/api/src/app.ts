import { buildDependencyContainer } from "./di/buildDependencyContainer";
import express from "express";
import { query, validationResult } from "express-validator";
import cors from "cors";
import { Tracer } from "@polywrap/registry-js";
import fs from "fs";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("custom-env").env(process.env.ENV);

Tracer.enableTracing("verifier-client");

const dependencyContainer = buildDependencyContainer();
const {
  verifierClient,
  apiServerConfig,
  webUiServerConfig,
  logger,
  ethersProvider,
} = dependencyContainer.cradle;

export async function run(): Promise<void> {
  const app = express();

  const corsOptions = {
    origin: webUiServerConfig.uri,
  };

  const isLogLevelOrNull = (level: string) => {
    return ["", "debug", "info", "warn", "error"].includes(level);
  };

  app.use(cors(corsOptions));
  app.use(express.json());

  app.get("/info", (_, res) => {
    logger.debug(`API request: info`);
    res.send({
      status: "running",
    });
  });

  app.get(
    "/logs",
    query("page").isInt(),
    query("limit").isInt(),
    query("filterBy").custom(isLogLevelOrNull),
    async (req, res) => {
      logger.debug(`API request: logs`);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      let limit = 50;
      let skip = 0;
      let filterBy = "";
      let search = "";

      if (req.query) {
        const page = req.query?.page ? (req.query.page as number) : 1;
        limit = req.query?.limit ? (req.query.limit as number) : limit;
        skip = (page - 1) * limit;
        filterBy = req.query?.filterBy
          ? (req.query.filterBy as string)
          : filterBy;
        search = req.query?.search ? (req.query.search as string) : search;
      }

      const text = await fs.promises.readFile(
        `${__dirname}/../verifier_client.log`,
        "utf-8"
      );
      const allLogs = text
        .split("\n")
        .filter((line) => line.trim() !== "")
        .map((line) => JSON.parse(line));
      const sortedLogs = allLogs.sort((a, b) => +b.timestamp - +a.timestamp);
      const levelFilteredLogs = filterBy
        ? sortedLogs.filter((log) => log.level === filterBy)
        : sortedLogs;
      const searchLogs = search
        ? levelFilteredLogs.filter((log) => log.message.includes(search))
        : levelFilteredLogs;
      const paginatedLogs = searchLogs.slice(skip, skip + limit);
      res.send(paginatedLogs);
    }
  );

  app.listen(apiServerConfig.port, () => {
    logger.debug(
      `API is running on port ${apiServerConfig.port}. Check status here: http://localhost:${apiServerConfig.port}/info`
    );
  });

  await verifierClient.run();
}
