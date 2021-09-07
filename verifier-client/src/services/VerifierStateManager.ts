import * as fs from 'fs';
import { VerifierStateInfo } from '../VerifierStateInfo';

export class VerifierStateManager {
  public state: VerifierStateInfo;

  constructor(_state: VerifierStateInfo) {
    this.state = _state;
  }

  static load(): VerifierStateInfo {
    let verifierStateInfo: VerifierStateInfo = {
      lastProcessedBlock: -1,
      lastProcessedTransactionIndex: -1,
      lastProcessedLogIndex: -1,
      currentlyProcessingBlock: 0
    };

    if (fs.existsSync(process.env.STATE_INFO_PATH!)) {
      verifierStateInfo = JSON.parse(fs.readFileSync(process.env.STATE_INFO_PATH!, { encoding: 'utf8', flag: 'r' }));
    }

    return verifierStateInfo;
  }

  save(): void {
    fs.writeFileSync(process.env.STATE_INFO_PATH!, JSON.stringify(this.state, null, 2));
  }
}