/*
usage example

const { fromXpub } = require('./src/bip44-address');
const xpub = 'xpubkeyhere';

for (let i = 0; i < 20; i++) {
  console.log(fromXpub(xpub, i, '0', 'kmd') + '  ' + fromXpub(xpub, i, '1', 'kmd') + '  ' + fromXpub(xpub, i, '2', 'kmd'));
}
*/

const bitcoin = require('bitcoinjs-lib');
const networks = require('./bitcoinjs-networks');

const fromXpub = (xpub, acc, ind, network) => {
  return bitcoin.HDNode.fromBase58(xpub, network ? networks[network] : networks.btc).derivePath(`${acc}/${ind}`).getAddress(); 
}

module.exports = {
  fromXpub,
};