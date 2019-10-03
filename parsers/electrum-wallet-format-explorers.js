const servers = require('../src/electrum-servers');
const {
  kmdAssetChains,
  explorerList,
} = require('../src/coin-helpers');

for (let i = 0; i < kmdAssetChains.length; i++) {
  const key = kmdAssetChains[i];

  if (explorerList[key.toUpperCase()]) {
    console.log(`"${key}": "${explorerList[key.toUpperCase()]}",`);
  }
}