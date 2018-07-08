'use strict';

var aes256 = require('nodejs-aes256');
var iocane = require('iocane');
var session = iocane.createSession().use('cbc').setDerivationRounds(300000);

var _encrypt = session.encrypt.bind(session);
var _decrypt = session.decrypt.bind(session);
var Promise = require('bluebird');

var encrypt = function encrypt(cipherKey, string) {
  return new Promise(function (resolve, reject) {
    _encrypt(string, cipherKey).then(function (encryptedString) {
      resolve(encryptedString);
    });
  });
};

var decrypt = function decrypt(cipherKey, string) {
  var encryptedKey = aes256.decrypt(cipherKey, string);
  // test if stored encrypted passphrase is decrypted correctly
  // if not then the key is wrong
  var _regexTest = encryptedKey.match(/^[0-9a-zA-Z ]+$/g);

  return new Promise(function (resolve, reject) {
    if (_regexTest) {
      resolve({
        string: encryptedKey,
        old: true
      });
    } else {
      _decrypt(string, cipherKey).then(function (decryptedKey) {
        resolve({ string: decryptedKey });
      }).catch(function (err) {
        resolve(false);
      });
    }
  });
};

module.exports = {
  encrypt: encrypt,
  decrypt: decrypt
};