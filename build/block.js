'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var bitcoinZcash = require('bitgo-utxo-lib');
var bitcoin = require('bitcoinjs-lib');
var bitcoinPos = require('bitcoinjs-lib-pos');

var parseBlock = function parseBlock(hex, network) {
  var block = network && network.isZcash ? bitcoinZcash.Block.fromBuffer(new Buffer.from(hex, 'hex'), network, true) : bitcoin.Block.fromBuffer(new Buffer.from(hex, 'hex'));
  return block;
};

var parseBlockToJSON = function parseBlockToJSON(hex, network) {
  if (typeof hex === 'string') {
    hex = parseBlock(hex, network);

    if (hex.hasOwnProperty('merkle_root')) {
      hex.merkleRoot = hex.merkle_root;
      delete hex.merkle_root;
    }

    for (var key in hex) {
      if (_typeof(hex[key]) === 'object') {
        hex[key] = key !== 'solution' ? hex[key].reverse().toString('hex') : hex[key].toString('hex');
      }
    }
  }

  return hex;
};

var electrumMerkleRoot = function electrumMerkleRoot(parsedBlock) {
  // legacy
  if (parsedBlock.merkleRoot) {
    // electrum protocol v1.4
    return new Buffer(parsedBlock.merkleRoot.reverse()).toString('hex');
  } else {
    return parsedBlock.merkle_root;
  }
};

module.exports = {
  parseBlock: parseBlock,
  parseBlockToJSON: parseBlockToJSON,
  electrumMerkleRoot: electrumMerkleRoot
};