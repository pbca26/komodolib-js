'use strict';

var reverse = require('buffer-reverse');
var crypto = require('crypto');
var sha256 = function sha256(data) {
  return crypto.createHash('sha256').update(data).digest();
};

var getMerkleRoot = function getMerkleRoot(txid, proof, pos) {
  var hash = txid;
  var serialized = void 0;

  for (i = 0; i < proof.length; i++) {
    var _hashBuff = new Buffer(hash, 'hex');
    var _proofBuff = new Buffer(proof[i], 'hex');

    if ((pos & 1) == 0) {
      serialized = Buffer.concat([reverse(_hashBuff), reverse(_proofBuff)]);
    } else {
      serialized = Buffer.concat([reverse(_proofBuff), reverse(_hashBuff)]);
    }

    hash = reverse(sha256(sha256(serialized))).toString('hex');
    pos /= 2;
  }

  return hash;
};

module.exports = getMerkleRoot;