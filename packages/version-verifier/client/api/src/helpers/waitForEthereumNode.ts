import { handleError } from "@polywrap/registry-js";
import { providers } from "ethers";
import { Logger } from "winston";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function waitForEthereumNode(
  ethersProvider: providers.Provider,
  logger: Logger
): Promise<void> {
  let delay = 1000;
  while (delay) {
    const [error] = await handleError(async () => {
      return await ethersProvider.getBlockNumber();
    })();

    if (error) {
      logger.info(
        `Unable to connect to the ethereum node, retrying in ${
          delay / 1000
        } seconds`
      );
    } else break;

    await sleep(delay);
    delay *= 2;
  }
}
