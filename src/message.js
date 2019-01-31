const bitcoinMessage = require('bitcoinjs-message');
const wif = require('wif');
const ethers = require('ethers');

const signBTC = (_wif, message) => {
  const keyPair = wif.decode(_wif);
  
  const signature = bitcoinMessage.sign(message, keyPair.privateKey, keyPair.compressed);
  return signature.toString('base64');
};

const verifyBTC = (address, message, sig) => {
  try {
    return bitcoinMessage.verify(message, address, sig);
  } catch (e) {
    return false;
  };
};

const signETH = (privKey, message) => {
  const signingKey = new ethers.utils.SigningKey(privKey);
  const messageBytes = ethers.utils.toUtf8Bytes(message);
  const messageDigest = ethers.utils.keccak256(messageBytes);
  const signature = signingKey.signDigest(messageDigest);
  
  return Buffer.from(JSON.stringify(signature)).toString('base64');
};

const verifyETH = (address, message, sig) => {
  let signature;
  
  try {
    signature = JSON.parse(new Buffer(sig, 'base64').toString());
  } catch (e) {
    return false;
  }

  const messageBytes = ethers.utils.toUtf8Bytes(message);
  const messageDigest = ethers.utils.keccak256(messageBytes);
  const recoveredAddress = ethers.utils.recoverAddress(messageDigest, signature);
  
  return address === recoveredAddress ? true : false;
};

module.exports = {
  btc: {
    sign: signBTC,
    verify: verifyBTC,
  },
  eth: {
    sign: signETH,
    verify: verifyETH,
  },
};