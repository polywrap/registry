import { ContractReceipt, ethers, Signer } from "ethers";
import { VotingMachine__factory, VotingMachine } from "./typechain";

export class RegistryAuthority {
  constructor(signer: Signer, votingMachineAddress: string) {
    this.signer = signer;
    this.votingMachine = VotingMachine__factory.connect(
      votingMachineAddress,
      this.signer
    );
  }

  signer: ethers.Signer;
  private votingMachine: VotingMachine;

  async authorizeVerifiers(
    verifierAddresses: string[]
  ): Promise<ContractReceipt> {
    const tx = await this.votingMachine.authorizeVerifiers(verifierAddresses);
    return await tx.wait();
  }
}
