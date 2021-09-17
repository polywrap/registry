export class VerifierClientConfig {
  verifierPrivateKey = process.env.VERIFIER_CLIENT_KEY ?? "";
  numOfConfirmationsToWait = process.env.NUM_OF_CONFIRMATIONS_TO_WAIT
    ? +process.env.NUM_OF_CONFIRMATIONS_TO_WAIT
    : 1;
  stateInfoPath = process.env.STATE_INFO_PATH ?? "./state-info.json";
  pauseTimeInMiliseconds = process.env.PAUSE_TIME
    ? +process.env.PAUSE_TIME
    : 10000;
}
