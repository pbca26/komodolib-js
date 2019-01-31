'use strict';

var bitcoinMessage = require('bitcoinjs-message');
var wif = require('wif');
var ethers = require('ethers');

var signBTC = function signBTC(_wif, message) {
  var keyPair = wif.decode(_wif);

  var signature = bitcoinMessage.sign(message, keyPair.privateKey, keyPair.compressed);
  return signature.toString('base64');
};

var verifyBTC = function verifyBTC(address, message, sig) {
  try {
    return bitcoinMessage.verify(message, address, sig);
  } catch (e) {
    return false;
  };
};

var signETH = function signETH(privKey, message) {
  var signingKey = new ethers.utils.SigningKey(privKey);
  var messageBytes = ethers.utils.toUtf8Bytes(message);
  var messageDigest = ethers.utils.keccak256(messageBytes);
  var signature = signingKey.signDigest(messageDigest);

  return Buffer.from(JSON.stringify(signature)).toString('base64');
};

var verifyETH = function verifyETH(address, message, sig) {
  var signature = void 0;

  try {
    signature = JSON.parse(new Buffer(sig, 'base64').toString());
  } catch (e) {
    return false;
  }

  var messageBytes = ethers.utils.toUtf8Bytes(message);
  var messageDigest = ethers.utils.keccak256(messageBytes);
  var recoveredAddress = ethers.utils.recoverAddress(messageDigest, signature);

  return address === recoveredAddress ? true : false;
};

module.exports = {
  btc: {
    sign: signBTC,
    verify: verifyBTC
  },
  eth: {
    sign: signETH,
    verify: verifyETH
  }
};