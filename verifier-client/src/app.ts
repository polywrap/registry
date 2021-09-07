import { buildDependencyContainer } from './di/buildDependencyContainer';

require('custom-env').env();

const container = buildDependencyContainer();
const verifierClient = container.cradle.verifierClient;

var argv = require('minimist')(process.argv.slice(2));

if (argv._ && argv._.length !== 0) {
  const command = argv._[0];

  (async () => {
    switch (command) {
      case 'run':
        await verifierClient.run();
        break;
      default:
        console.log(`Command not found: ${command}.`)
        break;
    }
  })();
} else {
  console.log('No command specified.')
}
