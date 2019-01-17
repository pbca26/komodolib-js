const bitcoinZcash = require('bitgo-utxo-lib');
const bitcoin = require('bitcoinjs-lib');
const bitcoinPos = require('bitcoinjs-lib-pos');

const parseBlock = (hex, network) => {
  const block = network && network.isZcash ? bitcoinZcash.Block.fromBuffer(new Buffer.from(hex, 'hex'), network, true) : bitcoin.Block.fromBuffer(new Buffer.from(hex, 'hex'));
  return block;
};

const electrumMerkleRoot = (parsedBlock) => {
  if (parsedBlock.merkleRoot) { // electrum protocol v1.4
    return new Buffer(parsedBlock.merkleRoot.reverse()).toString('hex');
  } else {
    return parsedBlock.merkle_root;
  }
};

module.exports = {
  parseBlock,
  electrumMerkleRoot,
};