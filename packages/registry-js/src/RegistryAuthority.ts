import { ethers, Signer } from "ethers";
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

  async authorizeVerifiers(verifierAddresses: string[]) {
    const receipt = await this.votingMachine.authorizeVerifiers(verifierAddresses);

    await receipt.wait();
  }
}
