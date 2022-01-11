import {
  deserializeWeb3ApiManifest,
  Uri,
  Web3ApiClient,
  Web3ApiManifest,
} from "@web3api/client-js";

export class IpfsPublisher {
  polywrapClient: Web3ApiClient;

  constructor(deps: { polywrapClient: Web3ApiClient }) {
    this.polywrapClient = deps.polywrapClient;
  }

  async publish(uri: string): Promise<string> {
    this.polywrapClient["_apiCache"].set(uri, {
      getManifest: (): Promise<Web3ApiManifest> => {
        return Promise.resolve(deserializeWeb3ApiManifest(`${uri}_manifest`));
      },
      getSchema: (): Promise<string> => {
        return Promise.resolve(`${uri}_schema`);
      },
    });

    return uri;
  }
}
