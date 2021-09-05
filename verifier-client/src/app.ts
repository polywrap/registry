import * as dotenv from "dotenv";
import { runVerifier } from "./runVerifier";

dotenv.config();

var argv = require('minimist')(process.argv.slice(2));

if (argv._ && argv._.length !== 0) {
  const command = argv._[0];

  (async () => {
    switch (command) {
      case 'run':
        await runVerifier();
        break;
      default:
        console.log(`Command not found: ${command}.`)
        break;
    }
  })();
} else {
  console.log('No command specified.')
}
