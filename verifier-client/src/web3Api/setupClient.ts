import { Web3ApiClient, PluginRegistration } from "@web3api/client-js";
import { ensPlugin } from "@web3api/ens-plugin-js";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { ipfsPlugin } from "@web3api/ipfs-plugin-js";

export async function setupWeb3ApiClient({
  ethersProvider,
}): Promise<Web3ApiClient> {
  const plugins: PluginRegistration[] = [
    {
      uri: "w3://ens/ethereum.web3api.eth",
      plugin: ethereumPlugin({
        networks: {
          rinkeby: {
            provider: ethersProvider,
          },
        },
      }),
    },
    {
      uri: "w3://ens/ipfs.web3api.eth",
      plugin: ipfsPlugin({ provider: "https://ipfs.io" }),
    },
    {
      uri: "w3://ens/ens.web3api.eth",
      plugin: ensPlugin({}),
    },
  ];

  return new Web3ApiClient({ plugins });
}
