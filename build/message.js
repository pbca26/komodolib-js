'use strict';

var bitcoinMessage = require('bitcoinjs-message');
var wif = require('wif');

var sign = function sign(_wif, message) {
  var keyPair = wif.decode(_wif);

  var signature = bitcoinMessage.sign(message, keyPair.privateKey, keyPair.compressed);
  return signature.toString('base64');
};

var verify = function verify(address, message, sig) {
  try {
    return bitcoinMessage.verify(message, address, sig);
  } catch (e) {
    return false;
  };
};

module.exports = {
  sign: sign,
  verify: verify
};