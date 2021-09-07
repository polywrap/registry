import { create, IPFSHTTPClient } from "ipfs-http-client";
import { VotingMachine } from "../typechain";
import { processProposedVersion } from "./processProposedVersion";
import { ProposedVersionEventArgs } from "./ProposedVersionEventArgs";
import { VerifierStateInfo } from "./VerifierStateInfo";

export const processProposedVersionEvent = async (
  votingMachine: VotingMachine,
  client: IPFSHTTPClient,
  stateInfo: VerifierStateInfo, 
  event: {
    blockNumber: number,
    transactionIndex: number,
    logIndex: number,
    args: ProposedVersionEventArgs
  }
) => {
  if(event.blockNumber < stateInfo.currentlyProcessingBlock) {
    return;
  }
  else if(event.blockNumber > stateInfo.currentlyProcessingBlock) {
    stateInfo.lastProcessedBlock = stateInfo.currentlyProcessingBlock;
    stateInfo.currentlyProcessingBlock = event.blockNumber;

    stateInfo.lastProcessedTransactionIndex = -1;
    stateInfo.lastProcessedLogIndex = -1;
  }
  else {
    if(event.transactionIndex < stateInfo.lastProcessedTransactionIndex) {
      return;
    }
    else if(event.transactionIndex > stateInfo.lastProcessedTransactionIndex){
      stateInfo.lastProcessedLogIndex = -1;
    }
    else {
      if(event.logIndex <= stateInfo.lastProcessedLogIndex) {
        return;
      }
    }
  }

  await processProposedVersion(votingMachine, client, event.args);

  stateInfo.lastProcessedTransactionIndex = event.transactionIndex;
  stateInfo.lastProcessedLogIndex = event.logIndex;
};