'use strict';

/*
usage example

const { fromXpub } = require('./src/bip44-address');
const xpub = 'xpubkeyhere';

for (let i = 0; i < 20; i++) {
  console.log(fromXpub(xpub, i, '0', 'kmd') + '  ' + fromXpub(xpub, i, '1', 'kmd') + '  ' + fromXpub(xpub, i, '2', 'kmd'));
}
*/

var bitcoin = require('bitcoinjs-lib');
var networks = require('./bitcoinjs-networks');

var fromXpub = function fromXpub(xpub, acc, ind, network) {
  return bitcoin.HDNode.fromBase58(xpub, network ? networks[network] : networks.btc).derivePath(acc + '/' + ind).getAddress();
};

module.exports = {
  fromXpub: fromXpub
};