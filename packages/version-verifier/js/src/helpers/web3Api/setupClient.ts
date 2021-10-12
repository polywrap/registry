import { Web3ApiClient, PluginRegistration } from "@web3api/client-js";
import { ensPlugin } from "@web3api/ens-plugin-js";
import { ethereumPlugin, EthereumProvider } from "@web3api/ethereum-plugin-js";
import { ipfsPlugin } from "@web3api/ipfs-plugin-js";

interface Web3APiOptions {
  ethersProvider: EthereumProvider;
  ipfsProvider: string;
}

export function setupWeb3ApiClient(options: Web3APiOptions): Web3ApiClient {
  const plugins: PluginRegistration[] = [
    {
      uri: "w3://ens/ethereum.web3api.eth",
      plugin: ethereumPlugin({
        networks: {
          rinkeby: {
            provider: options.ethersProvider,
          },
        },
      }),
    },
    {
      uri: "w3://ens/ipfs.web3api.eth",
      plugin: ipfsPlugin({ provider: options.ipfsProvider }),
    },
    {
      uri: "w3://ens/ens.web3api.eth",
      plugin: ensPlugin({}),
    },
  ];

  return new Web3ApiClient({ plugins });
}
