const bitcoinMessage = require('bitcoinjs-message');
const wif = require('wif');

const sign = (_wif, message) => {
  const keyPair = wif.decode(_wif);
  
  const signature = bitcoinMessage.sign(message, keyPair.privateKey, keyPair.compressed);
  return signature.toString('base64');
};

const verify = (address, message, sig) => {
  try {
    return bitcoinMessage.verify(message, address, sig);
  } catch (e) {
    return false;
  };
};

module.exports = {
  sign,
  verify,
};