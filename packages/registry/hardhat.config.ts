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
import { NetworkUserConfig } from "hardhat/types";

task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const liveNetworks: {
  [networkName: string]: NetworkUserConfig | undefined;
} = {};

if (process.env.RINKEBY_URL) {
  liveNetworks.rinkeby = {
    live: true,
    gas: "auto",
    gasPrice: "auto",
    gasMultiplier: 1,
    chainId: 4,
    url: process.env.RINKEBY_URL,
    accounts: [`${process.env.DEPLOYER_KEY_RINKEBY}`],
    deploy: ["./deploy/scripts/v1/rinkeby"],
  };
}

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
    ...liveNetworks,
  },
  etherscan: {
    apiKey: "FZ1ANB251FC8ISFDXFGFCUDCANSJNWPF9Q",
  },
  gasReporter: {
    enabled: false,
  },
};

export default config;
