import { exec, ExecException } from "child_process";
import axios from "axios";
import dotenv from "dotenv";
import { runCommand } from "registry-test-utils";

enum HTTPMethod {
  GET,
  POST,
}

async function awaitResponse(
  url: string,
  expectedRes: string,
  getPost: HTTPMethod,
  timeout: number,
  maxTimeout: number,
  data?: string
) {
  let time = 0;

  while (time < maxTimeout) {
    let success: boolean;
    if (getPost === HTTPMethod.GET) {
      success = await axios
        .get(url)
        .then(function (response) {
          const responseData = JSON.stringify(response.data);
          return responseData.indexOf(expectedRes) > -1;
        })
        .catch(function () {
          return false;
        });
    } else {
      success = await axios
        .post(url, data)
        .then(function (response) {
          const responseData = JSON.stringify(response.data);
          return responseData.indexOf(expectedRes) > -1;
        })
        .catch(function () {
          return false;
        });
    }

    if (success) {
      return true;
    }

    await new Promise<void>(function (resolve) {
      setTimeout(() => resolve(), timeout);
    });

    time += timeout;
  }

  return false;
}

export async function up(cwd: string, quiet = false): Promise<void> {
  await runCommand("docker-compose up -d", quiet, cwd);

  // Wait for all endpoints to become available
  let success = false;

  // IPFS
  success = await awaitResponse(
    `http://localhost:${process.env.IPFS_PORT}/api/v0/version`,
    '"Version":',
    HTTPMethod.GET,
    2000,
    20000
  );

  if (!success) {
    throw Error("test-env: IPFS failed to start");
  }
}

export async function down(cwd: string, quiet = false): Promise<void> {
  await runCommand("docker-compose down", quiet, cwd);
  // Sleep for a few seconds to make sure all services are torn down
  await new Promise<void>((resolve) => setTimeout(() => resolve(), 5000));
}
