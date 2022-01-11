import { JsonRpcProvider } from "@web3api/client-js/build/pluginConfigs/Ethereum";
import {
  Uri,
  Web3ApiManifest,
  deserializeWeb3ApiManifest,
} from "@web3api/core-js";
import { PolywrapClient } from "../integration/VersionPublish.spec";
import { registryUriResolverPlugin } from "../../..";
import { IpfsPublisher } from "./IpfsPublisher";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";

export const verifyPolywrapClientCanQueryPackage = async (
  packageUri: string,
  packageLocation: string
): Promise<void> => {
  const client = PolywrapClient.create()
    .includeDefaultConfig({
      plugins: [
        {
          uri: "ens/ethereum.web3api.eth",
          plugin: ethereumPlugin({
            networks: {
              homestead: {
                provider: (owner.provider as unknown) as JsonRpcProvider,
              },
            },
          }),
        },
        {
          uri: "ens/registry-uri-resolver.web3api.eth",
          plugin: registryUriResolverPlugin({
            addresses: {
              homestead: registryContractAddresses.polywrapRegistry,
            },
          }),
        },
      ],
    })
    .override()
    .overrideInterface("ens/uri-resolver.core.web3api.eth", [
      "ens/registry-uri-resolver.web3api.eth",
    ])
    .buildOverrides()
    .build();

  const originalFunc = client["_loadWeb3Api"];
  client["_loadWeb3Api"] = async (uri: Uri, contextId: string | undefined) => {
    console.log("uriiiiiiiii", uri.toString());
    if (uri.authority === "ipfs") {
      return {
        getManifest: (): Promise<Web3ApiManifest> => {
          return Promise.resolve(deserializeWeb3ApiManifest(`${uri}_manifest`));
        },
        getSchema: (): Promise<string> => {
          return Promise.resolve(`${uri}_schema`);
        },
      };
    }

    return await originalFunc.call(client, uri, contextId);
  };

  const publisher = new IpfsPublisher({ polywrapClient: client });
  publisher.publish(`w3://ipfs/${packageLocation}`);

  expect(await client.getSchema(packageUri)).to.equal(
    `w3://ipfs/${packageLocation}_schema`
  );
};
