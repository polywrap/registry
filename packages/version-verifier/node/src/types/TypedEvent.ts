import { ProposedVersionEventArgs } from "./ProposedVersionEventArgs";

export interface TypedEvent {
  blockNumber: number;
  transactionIndex: number;
  logIndex: number;
  args: ProposedVersionEventArgs;
}
