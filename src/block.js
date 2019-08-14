const bitcoinZcash = require('bitgo-utxo-lib');
const bitcoin = require('bitcoinjs-lib');
const bitcoinPos = require('bitcoinjs-lib-pos');

const parseBlock = (hex, network) => {
  const block = network && network.isZcash ? bitcoinZcash.Block.fromBuffer(new Buffer.from(hex, 'hex'), network, true) : bitcoin.Block.fromBuffer(new Buffer.from(hex, 'hex'));
  return block;
};

const parseBlockToJSON = (hex, network) => {
  if (typeof hex === 'string') {            
    hex = parseBlock(hex, network);

    if (hex.hasOwnProperty('merkle_root')) {
      hex.merkleRoot = hex.merkle_root;
      delete hex.merkle_root;
    }

    for (let key in hex) {
      if (typeof hex[key] === 'object') {
        hex[key] = key !== 'solution' ? hex[key].reverse().toString('hex') : hex[key].toString('hex');
      }
    }
  }

  return hex;
};

const electrumMerkleRoot = (parsedBlock) => { // legacy
  if (parsedBlock.merkleRoot) { // electrum protocol v1.4
    return new Buffer(parsedBlock.merkleRoot.reverse()).toString('hex');
  } else {
    return parsedBlock.merkle_root;
  }
};

module.exports = {
  parseBlock,
  parseBlockToJSON,
  electrumMerkleRoot,
};