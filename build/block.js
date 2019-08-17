"use strict";

var bitcoin = require('bitgo-utxo-lib');

var parseBlock = function parseBlock(hex, network) {
  var block = bitcoin.Block.fromBuffer(Buffer.from(hex, 'hex'), network, true);
  return block;
};

var electrumMerkleRoot = function electrumMerkleRoot(parsedBlock) {
  if (parsedBlock.merkleRoot) {
    // electrum protocol v1.4
    return Buffer.from(parsedBlock.merkleRoot.reverse()).toString('hex');
  } else {
    return parsedBlock.merkle_root;
  }
};

module.exports = {
  parseBlock: parseBlock,
  electrumMerkleRoot: electrumMerkleRoot
};