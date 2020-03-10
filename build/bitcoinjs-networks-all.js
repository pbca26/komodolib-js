'use strict';

var networks = require('./bitcoinjs-networks');

var _require = require('./coin-helpers'),
    kmdAssetChains = _require.kmdAssetChains;

var _networks = JSON.parse(JSON.stringify(networks));
var acNetworkData = JSON.parse(JSON.stringify(networks.kmd));
delete acNetworkData.kmdInterest;

for (var i = 0; i < kmdAssetChains.length; i++) {
  if (!_networks[kmdAssetChains[i].toLowerCase()]) {
    _networks[kmdAssetChains[i].toLowerCase()] = acNetworkData;
  }
}

module.exports = _networks;