import {
  deserializeWeb3ApiManifest,
  Uri,
  Web3ApiClient,
  Web3ApiManifest,
} from "@web3api/client-js";
import fs from "fs";

export class IpfsPublisher {
  polywrapClient: Web3ApiClient;

  constructor(deps: { polywrapClient: Web3ApiClient }) {
    this.polywrapClient = deps.polywrapClient;
  }

  async publishDir(buildPath: string): Promise<string> {
    const cid = fs.readFileSync(`${buildPath}/.cid`, { encoding: "utf-8" });

    const uri = new Uri(`w3://ipfs/${cid}`);

    this.polywrapClient["_apiCache"].set(uri.uri, {
      getManifest: (): Promise<Web3ApiManifest> => {
        return Promise.resolve(
          deserializeWeb3ApiManifest(
            fs.readFileSync(buildPath + "/web3api.yaml", {
              encoding: "utf-8",
            })
          )
        );
      },
      getSchema: (): Promise<string> => {
        return Promise.resolve(
          fs.readFileSync(buildPath + "/schema.graphql", {
            encoding: "utf-8",
          })
        );
      },
    });

    return cid;
  }
}
