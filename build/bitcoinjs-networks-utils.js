'use strict';

var networks = require('./bitcoinjs-networks.js');

var bip32Compatible = function bip32Compatible() {
  var _items = [];

  for (var key in networks) {
    if (networks[key].bip32) {
      _items.push(networks[key]);
    }
  }

  return _items;
};

var bip44Compatible = function bip44Compatible() {
  var _items = [];

  for (var key in networks) {
    if (networks[key].bip32 && networks[key].bip44) {
      _items.push(networks[key]);
    }
  }

  return _items;
};

module.exports = {
  bip32Compatible: bip32Compatible,
  bip44Compatible: bip44Compatible
};