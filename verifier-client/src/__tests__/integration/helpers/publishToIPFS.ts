import { globSource, IPFSHTTPClient } from "ipfs-http-client";

export default async function publishToIPFS(
  buildPath: string,
  client: IPFSHTTPClient
): Promise<string> {
  const globOptions = {
    recursive: true,
  };

  const addOptions = {
    wrapWithDirectory: false,
  };

  let rootCID = "";

  for await (const file of client.addAll(
    globSource(buildPath, globOptions),
    addOptions
  )) {
    if (file.path.indexOf("/") === -1) {
      rootCID = file.cid.toString();
    }
  }

  return rootCID;
}
