import { Web3ApiClientConfig } from "@web3api/client-js";
import { ipfsPlugin } from "@web3api/ipfs-plugin-js";

export function getClientConfig(defaultConfigs: Partial<Web3ApiClientConfig>) {
  const ipfsPluginConfig = {
    uri: "ens/ipfs.web3api.eth",
    plugin: ipfsPlugin({
      provider: "https://ipfs.wrappers.io",
    }),
  };

  if (defaultConfigs.plugins) {
    defaultConfigs.plugins.push(ipfsPluginConfig);
  } else {
    defaultConfigs.plugins = [ipfsPluginConfig];
  }

  return defaultConfigs;
}
