import { IPFSHTTPClient } from "ipfs-http-client";
import { getFileFromIpfs } from "./getFileFromIpfs";
import * as yaml from "js-yaml";

export const getSchemaFileFromIpfs = async (client: IPFSHTTPClient, cid: string): Promise<string> => {
  const schemaFile = await getFileFromIpfs(client, `${cid}`);

  return schemaFile;

  // const file = await getFileFromIpfs(client, `${cid}/web3api.yaml`);

  // const manifest: any = yaml.load(file);

  // const schemaFilePath = manifest.modules.mutation.schema.slice(2, manifest.modules.mutation.schema.length);

  // const schemaFile = await getFileFromIpfs(client, `${cid}/${schemaFilePath}`);

  // return schemaFile;
};