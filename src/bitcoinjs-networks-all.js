const networks = require('./bitcoinjs-networks');
const { kmdAssetChains } = require('./coin-helpers');
let _networks = JSON.parse(JSON.stringify(networks));
let acNetworkData = JSON.parse(JSON.stringify(networks.kmd));
delete acNetworkData.kmdInterest;

for (let i = 0; i < kmdAssetChains.length; i++) {
  if (!_networks[kmdAssetChains[i].toLowerCase()]) {
    _networks[kmdAssetChains[i].toLowerCase()] = acNetworkData;
  }
}

module.exports = _networks;