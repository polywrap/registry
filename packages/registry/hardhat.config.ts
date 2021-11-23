// eslint-disable-next-line @typescript-eslint/no-var-requires
require("custom-env").env(process.env.ENV);

import { task, HardhatUserConfig } from "hardhat/config";
import "@typechain/hardhat";
import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-etherscan";
import "solidity-coverage";
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
import "hardhat-gas-reporter";
import "@nomiclabs/hardhat-waffle";

task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      { version: "0.8.4", settings: {} },
      { version: "0.8.10", settings: {} },
    ],
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
  },
  mocha: {
    timeout: 50000,
  },
  networks: {
    hardhat: {
      live: false,
      gas: "auto",
      gasPrice: "auto",
      gasMultiplier: 1,
      chainId: 1337,
      accounts: {
        mnemonic: "test test test test test test test test test test test test",
      },
      deploy: ["./deploy/scripts/v1/localhost"],

      // live: false,
      // forking: {
      //   url: "https://eth-mainnet.alchemyapi.io/v2/MnO3SuHlzuCydPWE1XhsYZM_pHZP8_ix",
      //   blockNumber: 11845661,
      // },
      // deploy: ["./deploy/scripts/localhosdsdst"],
    },
    localhost: {
      live: false,
      gas: "auto",
      gasPrice: "auto",
      gasMultiplier: 1,
      url: "http://127.0.0.1:8545",
      chainId: 1337,
      accounts: {
        mnemonic: "test test test test test test test test test test test test",
      },
      deploy: ["./deploy/scripts/localhost"],
    },
  },
  etherscan: {
    apiKey: "FZ1ANB251FC8ISFDXFGFCUDCANSJNWPF9Q",
  },
  gasReporter: {
    enabled: false,
  },
};
export default config;
