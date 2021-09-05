import path from "path";
import { exec, ExecException } from "child_process";
import * as dotenv from "dotenv";
import { authorizeVerifier } from "./authorizeVerifier";

dotenv.config();

jest.setTimeout(200000);

const shouldLog = process.env.LOG_TESTS === "true";

describe("Start local chain", () => {
  beforeAll(async () => {
  });

  beforeEach(async () => {
    await runCommand('docker-compose up -d', !shouldLog, `${__dirname}/../../../`);
    await runCommand('yarn hardhat deploy --network localhost', !shouldLog, `${__dirname}/../../../../`);
  });

  afterEach(async () => {
    await runCommand('docker-compose down', !shouldLog, `${__dirname}/../../../`);
  });

  it("start", async () => {
    await authorizeVerifier();
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
