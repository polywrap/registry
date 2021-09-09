import { ethers } from "ethers";
import { VotingMachine__factory } from "../../../typechain";
import * as VotingMachine from "../../../deployments/localhost/VotingMachine.json"

export const authorizeVerifier = async () => {
  var provider = ethers.providers.getDefaultProvider(`${process.env.PROVIDER_NETWORK}`);
  const signer = new ethers.Wallet(process.env.CLIENT_PRIVATE_KEY!, provider);

  let votingMachine = VotingMachine__factory.connect(VotingMachine.address, signer);

  const receipt = await votingMachine.authorizeVerifiers([signer.address]);

  const result = await receipt.wait(+process.env.NUM_OF_CONFIRMATIONS_TO_WAIT!);

  console.log(result);
};