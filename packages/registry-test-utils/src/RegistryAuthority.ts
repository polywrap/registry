import { ethers } from "ethers";
import * as VotingMachine from "./deployments/localhost/VotingMachine.json";
import { VotingMachine__factory } from "./typechain";

export class RegistryAuthority {
  constructor(provider: ethers.providers.Provider, privateKey: string) {
    this.signer = new ethers.Wallet(privateKey, provider);
  }

  signer: ethers.Wallet;

  async authorizeVerifiers(verifierAddresses: string[]) {
    const votingMachine = VotingMachine__factory.connect(
      VotingMachine.address,
      this.signer
    );

    const receipt = await votingMachine.authorizeVerifiers(verifierAddresses);

    await receipt.wait();
  }
}
