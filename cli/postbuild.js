const fs = require('fs');
const fse = require('fs-extra');

if (fs.existsSync('./typechain')) {
  fse.copy('./typechain', './verifier-client/src/typechain', function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log('Copied ./typechain to ./verifier-client/src/typechain');
    }
  });

  fse.copy('./typechain', './e2e/src/typechain', function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log('Copied ./typechain to ./e2e/src/typechain');
    }
  });
}