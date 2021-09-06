import { ethers } from "ethers";
import { create, IPFSHTTPClient } from "ipfs-http-client";
import { VotingMachine__factory } from "./typechain";
import { processProposedVersionEvent } from "./version-processing/processProposedVersionEvent";
import { VerifierStateInfo } from "./version-processing/VerifierStateInfo";
import * as fs from 'fs';
import * as VotingMachine from "./deployments/localhost/VotingMachine.json"

export const runVerifier = async () => {

  var provider = ethers.providers.getDefaultProvider(`${process.env.PROVIDER_NETWORK}:${process.env.ETHEREUM_PORT}`);

  const signer = new ethers.Wallet(process.env.CLIENT_PRIVATE_KEY!, provider);

  let votingMachine = VotingMachine__factory.connect(VotingMachine.address, signer);

  let verifierStateInfo: VerifierStateInfo = {
    lastProcessedBlock: -1,
    lastProcessedTransactionIndex: -1,
    lastProcessedLogIndex: -1,
    currentlyProcessingBlock: 0
  };

  const client = create({
    url: `http://ipfs:${process.env.IPFS_PORT}/api/v0`
  });

  if (fs.existsSync(process.env.STATE_INFO_PATH!)) {
    verifierStateInfo = JSON.parse(fs.readFileSync(process.env.STATE_INFO_PATH!, { encoding: 'utf8', flag: 'r' }));
  }

  let processedEventCnt = 0;
  while (true) {
    const proposedVersionEvents = await votingMachine.queryFilter(
      votingMachine.filters.VersionVotingStarted(),
      verifierStateInfo.currentlyProcessingBlock
    );

    for (let event of proposedVersionEvents) {
      //@ts-ignore
      await processProposedVersionEvent(votingMachine, client, verifierStateInfo, event);

      fs.writeFileSync(process.env.STATE_INFO_PATH!, JSON.stringify(verifierStateInfo, null, 2));
      processedEventCnt++;
    }
    console.log(`Processed ${processedEventCnt} events.`);

    await delay(+process.env.PAUSE_TIME!);
  }
};

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
