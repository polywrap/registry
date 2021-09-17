// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

import { task, HardhatUserConfig } from "hardhat/config";
import "@typechain/hardhat";
import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-etherscan";
import "solidity-coverage";
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";

task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{ version: "0.8.4", settings: {} }],
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  paths: {
    tests: "./src/__tests__/hardhat",
  },
  mocha: {
    timeout: 50000,
  },
  networks: {
    hardhat: {
      live: false,
      forking: {
        url:
          "https://eth-mainnet.alchemyapi.io/v2/MnO3SuHlzuCydPWE1XhsYZM_pHZP8_ix",
        blockNumber: 11845661,
      },
      accounts: {
        mnemonic: "test test test test test test test test test test test test",
      },
    },
  },
  external: {
    contracts: [
      {
        artifacts: "../registry/artifacts",
        deploy: "../registry/deploy",
      },
    ],
  },
  etherscan: {
    apiKey: "FZ1ANB251FC8ISFDXFGFCUDCANSJNWPF9Q",
  },
};
export default config;
