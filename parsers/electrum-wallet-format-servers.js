const servers = require('../src/electrum-servers');
const { kmdAssetChains } = require('../src/coin-helpers');

for (let i = 0; i < kmdAssetChains.length; i++) {
  const key = kmdAssetChains[i];

  if (servers[key.toLowerCase()] &&
      servers[key.toLowerCase()].serverList) {
    console.log(`"${key}": {`);
    
    for (let j = 0; j < servers[key.toLowerCase()].serverList.length; j++) {
      const server = servers[key.toLowerCase()].serverList[j].split(':');
      console.log(`  "${server[0]}": {`);
      console.log(`    "${server[2] === 'tcp' ? 't' : 's'}": "${server[1]}"`);

      if (j < servers[key.toLowerCase()].serverList.length - 1) {
        console.log('  },');
      } else {
        console.log('  }');
      }
    }

    console.log('},');
  }
}