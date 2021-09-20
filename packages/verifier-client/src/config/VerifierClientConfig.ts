export class VerifierClientConfig {
  verifierPrivateKey: string;
  numOfConfirmationsToWait: number;
  stateInfoPath: string;
  pauseTimeInMiliseconds: number;

  constructor() {
    this.verifierPrivateKey = process.env.VERIFIER_PRIVATE_KEY ?? "";
    this.numOfConfirmationsToWait = process.env.NUM_OF_CONFIRMATIONS_TO_WAIT
      ? +process.env.NUM_OF_CONFIRMATIONS_TO_WAIT
      : 1;
    this.stateInfoPath = process.env.STATE_INFO_PATH ?? "./state-info.json";
    this.pauseTimeInMiliseconds = process.env.PAUSE_TIME
      ? +process.env.PAUSE_TIME
      : 10000;
  }
}
