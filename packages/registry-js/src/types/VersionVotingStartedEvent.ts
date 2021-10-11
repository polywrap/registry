import { VersionVotingStartedEventArgs } from "./VersionVotingStartedEventArgs";

export interface VersionVotingStartedEvent {
  blockNumber: number;
  transactionIndex: number;
  logIndex: number;
  args: VersionVotingStartedEventArgs;
}
