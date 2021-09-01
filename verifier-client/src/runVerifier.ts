import { ethers } from "ethers";
import { create, IPFSHTTPClient } from "ipfs-http-client";
import { VotingMachine__factory } from "./typechain";
import { processProposedVersionEvent } from "./version-processing/processProposedVersionEvent";
import { VerifierStateInfo } from "./version-processing/VerifierStateInfo";
import * as fs from 'fs';

export const runVerifier = async () => {

  var provider = ethers.providers.getDefaultProvider(process.env.PROVIDER_NETWORK);

  const signer = new ethers.Wallet(process.env.CLIENT_PRIVATE_KEY!, provider);

  let votingMachine = VotingMachine__factory.connect(process.env.VOTING_MACHINE_CONTRACT_ADDRESS!, signer);

  let verifierStateInfo: VerifierStateInfo = {
    lastProcessedBlock: -1,
    lastProcessedTransactionIndex: -1,
    lastProcessedLogIndex: -1,
    currentlyProcessingBlock: 0
  };

  const client = create({
    url: process.env.IPFS_URI
  });

  const topicId = ethers.utils.id('VersionVotingStarted(bytes32,bytes32,uint256,uint256,uint256,string,address,bool');

  if (fs.existsSync('state-info.json')) {
    verifierStateInfo = JSON.parse(fs.readFileSync(process.env.STATE_INFO_PATH!, { encoding: 'utf8', flag: 'r' }));
  }

  while (true) {
    const proposedVersionEvents = await votingMachine.queryFilter({
      topics: [topicId]
    },
      verifierStateInfo.currentlyProcessingBlock,
      'latest');

    for (let event of proposedVersionEvents) {
      console.log(`Found event`);
      //@ts-ignore
      await processProposedVersionEvent(votingMachine, client, verifierStateInfo, event);

      fs.writeFileSync(process.env.STATE_INFO_PATH!, JSON.stringify(verifierStateInfo, null, 2));
    }
  }
};
