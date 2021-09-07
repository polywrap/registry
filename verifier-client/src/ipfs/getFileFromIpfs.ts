import { IPFSHTTPClient } from "ipfs-http-client";

export const getFileFromIpfs = async (client: IPFSHTTPClient, cid: string) =>{
  const stream = client.cat(cid)
  let data = ''
  for await (const chunk of stream) {
    data += chunk.toString()
  }
  return data;
}
  