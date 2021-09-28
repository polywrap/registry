import { traceFunc } from "@polywrap/registry-js";
import * as fs from "fs";
import { VerifierClientConfig } from "../config/VerifierClientConfig";
import { VerifierStateInfo } from "../VerifierStateInfo";

export class VerifierStateManager {
  public state: VerifierStateInfo;

  options: {
    memoryOnly: boolean;
  };

  private verifierClientConfig: VerifierClientConfig;

  constructor(
    verifierClientConfig: VerifierClientConfig,
    _state: VerifierStateInfo,
    options?: { memoryOnly: boolean }
  ) {
    this.verifierClientConfig = verifierClientConfig;
    this.state = _state;

    this.options = options
      ? options
      : {
          memoryOnly: false,
        };
  }

  @traceFunc("verifier-state-manager:load")
  static load(verifierClientConfig: VerifierClientConfig): VerifierStateInfo {
    let verifierStateInfo: VerifierStateInfo = {
      lastProcessedBlock: -1,
      lastProcessedTransactionIndex: -1,
      lastProcessedLogIndex: -1,
      currentlyProcessingBlock: 0,
    };

    if (fs.existsSync(verifierClientConfig.stateInfoPath)) {
      verifierStateInfo = JSON.parse(
        fs.readFileSync(verifierClientConfig.stateInfoPath, {
          encoding: "utf8",
          flag: "r",
        })
      );
    }

    return verifierStateInfo;
  }

  @traceFunc("verifier-state-manager:save")
  save(): void {
    if (this.options.memoryOnly) {
      return;
    }

    fs.writeFileSync(
      this.verifierClientConfig.stateInfoPath,
      JSON.stringify(this.state, null, 2)
    );
  }
}
