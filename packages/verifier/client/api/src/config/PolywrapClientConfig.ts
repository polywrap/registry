import { IpfsConfig } from "./IpfsConfig";

export class PolywrapClientConfig {
  constructor(deps: { ipfsConfig: IpfsConfig }) {
    this.ipfsProvider = deps.ipfsConfig.ipfsProvider;
  }

  ipfsProvider: string;
}
