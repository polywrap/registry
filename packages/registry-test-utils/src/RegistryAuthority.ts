import { ethers } from "ethers";
import { VotingMachine__factory } from "./typechain";
import * as VotingMachine from "./deployments/localhost/VotingMachine.json";

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
