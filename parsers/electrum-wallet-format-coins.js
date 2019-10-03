const servers = require('../src/electrum-servers');
const { kmdAssetChains } = require('../src/coin-helpers');

for (let i = 0; i < kmdAssetChains.length; i++) {
  const key = kmdAssetChains[i];

  if (servers[key.toLowerCase()] &&
      servers[key.toLowerCase()].serverList) {
    console.log(`"${key}": "${key}",`);
  }
}