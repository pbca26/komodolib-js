/**
 *
 * Extend bitcoinjs-networks.js object to include all Komodo asset chains listed in coin-helpers.js
 * Each asset chain is added as a separate property cloned from bitcoinjs-networks.js KMD entry
 * 
 */

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