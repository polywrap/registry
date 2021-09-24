import { CallOverrides, ContractTransaction, Overrides, Signer } from "ethers";
import { BytesLike } from "ethers/lib/utils";
import { RegistryContracts } from "./RegistryContracts";
import { VersionVotingStartedEvent } from "./VersionVotingStartedEvent";

export class PolywrapVotingSystem {
  constructor(signer: Signer, registryContracts: RegistryContracts) {
    this.signer = signer;
    this.registryContracts = registryContracts.connect(signer);
  }

  signer: Signer;
  private registryContracts: RegistryContracts;

  vote(
    votes: {
      patchNodeId: BytesLike;
      prevMinorNodeId: BytesLike;
      nextMinorNodeId: BytesLike;
      approved: boolean;
    }[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction> {
    return overrides
      ? this.registryContracts.votingMachine.vote(votes, overrides)
      : this.registryContracts.votingMachine.vote(votes);
  }

  getPrevPatchPackageLocation(
    patchNodeId: BytesLike,
    overrides?: CallOverrides
  ): Promise<string> {
    return overrides
      ? this.registryContracts.votingMachine.getPrevPatchPackageLocation(
          patchNodeId,
          overrides
        )
      : this.registryContracts.votingMachine.getPrevPatchPackageLocation(
          patchNodeId
        );
  }

  getPrevAndNextMinorPackageLocations(
    patchNodeId: BytesLike,
    overrides?: CallOverrides
  ): Promise<
    [string, string, string, string] & {
      prevMinorNodeId: string;
      prevPackageLocation: string;
      nextMinorNodeId: string;
      nextPackageLocation: string;
    }
  > {
    return overrides
      ? this.registryContracts.votingMachine.getPrevAndNextMinorPackageLocations(
          patchNodeId,
          overrides
        )
      : this.registryContracts.votingMachine.getPrevAndNextMinorPackageLocations(
          patchNodeId
        );
  }

  async queryVersionVotingStarted(
    blockNumber: number
  ): Promise<VersionVotingStartedEvent[]> {
    const resp = await this.registryContracts.votingMachine.queryFilter(
      this.registryContracts.votingMachine.filters.VersionVotingStarted(),
      blockNumber
    );

    return (resp as unknown) as VersionVotingStartedEvent[];
  }

  async isDecided(patchNodeId: BytesLike): Promise<boolean> {
    const resp = await this.registryContracts.votingMachine.isDecided(
      patchNodeId
    );
    return (resp as unknown) as boolean;
  }
}
