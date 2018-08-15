const reverse = require('buffer-reverse');
const crypto = require('crypto');

const sha256 = data => crypto.createHash('sha256').update(data).digest();

const getMerkleRoot = (txid, proof, pos) => {
  let hash = txid;
  let serialized;

  for (i = 0; i < proof.length; i++) {
    const _hashBuff = new Buffer(hash, 'hex');
    const _proofBuff = new Buffer(proof[i], 'hex');

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
