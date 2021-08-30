import { ethers } from "ethers";
import { VotingMachine__factory } from "./typechain";

export const authorizeVerifier = async () => {
  
  var provider = ethers.providers.getDefaultProvider(process.env.PROVIDER_NETWORK);
  const signer = new ethers.Wallet(process.env.CLIENT_PRIVATE_KEY!, provider);

  let votingMachine = VotingMachine__factory.connect(process.env.VOTING_MACHINE_CONTRACT_ADDRESS!, signer);

  const receipt = await votingMachine.authorizeVerifiers([signer.address]);

  const result = await receipt.wait();

  console.log(result);
};