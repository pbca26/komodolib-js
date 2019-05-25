'use strict';

var bitcoinZcash = require('bitgo-utxo-lib');
var bitcoin = require('bitcoinjs-lib');
var bitcoinPos = require('bitcoinjs-lib-pos');

var parseBlock = function parseBlock(hex, network) {
  var block = network && network.isZcash ? bitcoinZcash.Block.fromBuffer(new Buffer.from(hex, 'hex'), network, true) : bitcoin.Block.fromBuffer(new Buffer.from(hex, 'hex'));
  return block;
};

var electrumMerkleRoot = function electrumMerkleRoot(parsedBlock) {
  if (parsedBlock.merkleRoot) {
    // electrum protocol v1.4
    return new Buffer(parsedBlock.merkleRoot.reverse()).toString('hex');
  } else {
    return parsedBlock.merkle_root;
  }
};

module.exports = {
  parseBlock: parseBlock,
  electrumMerkleRoot: electrumMerkleRoot
};