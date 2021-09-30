import { ContractReceipt, ethers, Signer } from "ethers";
import { Logger } from "winston";
import { ContractCallResult } from "./helpers/contractResultTypes";
import { ErrorHandler } from "./errorHandler";
import { LogLevel } from "./logger";
import { VotingMachine__factory, VotingMachine } from "./typechain";

export class RegistryAuthority extends ErrorHandler {
  constructor(signer: Signer, votingMachineAddress: string, logger: Logger) {
    super();
    this.signer = signer;
    this.votingMachine = VotingMachine__factory.connect(
      votingMachineAddress,
      this.signer
    );
    this.logger = logger;
  }

  logger: Logger;
  signer: ethers.Signer;
  private votingMachine: VotingMachine;

  @RegistryAuthority.errorHandler(LogLevel.warn)
  async authorizeVerifiers(
    verifierAddresses: string[]
  ): Promise<ContractCallResult<ContractReceipt>> {
    const tx = await this.votingMachine.authorizeVerifiers(verifierAddresses);
    const receipt = await tx.wait();
    return {
      data: receipt,
      error: null,
    };
  }
}
