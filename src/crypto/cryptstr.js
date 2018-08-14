const aes256 = require('nodejs-aes256');
const iocane = require('iocane');
const session = iocane.createSession()
  .use('cbc')
  .setDerivationRounds(300000);

const _encrypt = session.encrypt.bind(session);
const _decrypt = session.decrypt.bind(session);
const Promise = require('bluebird');

const encrypt = (cipherKey, string, testPinStrength) => {
  return new Promise((resolve, reject) => {
    if (testPinStrength) { 
      const passwdStrength = require('passwd-strength');
      
      if (passwdStrength(_pin) < 29) {
        resolve(-1);
      }
    } else {
      _encrypt(string, cipherKey)
      .then((encryptedString) => {
        resolve(encryptedString);
      });
    }
  });
}

const decrypt = (cipherKey, string) => {
  const encryptedKey = aes256.decrypt(cipherKey, string);
  // test if stored encrypted passphrase is decrypted correctly
  // if not then the key is wrong
  const _regexTest = encryptedKey.match(/^[0-9a-zA-Z ]+$/g);

  return new Promise((resolve, reject) => {
    if (_regexTest) {
      resolve({
        string: encryptedKey,
        old: true,
      });
    } else {
      _decrypt(string, cipherKey)
      .then((decryptedKey) => {
        resolve({ string: decryptedKey });
      })
      .catch((err) => {
        resolve(false);
      });
    }    
  });
}

module.exports = {
  encrypt,
  decrypt,
};