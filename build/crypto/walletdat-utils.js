'use strict';

var wif = require('wif');

// data in wallet.dat format
var parseWalletdat = function parseWalletdat(data) {
  var re = /\x30\x81\xD3\x02\x01\x01\x04\x20(.{32})/gm;
  var dataHexStr = data.toString('latin1');
  privateKeys = dataHexStr.match(re);

  if (!privateKeys) {
    return 'wallet is encrypted?';
  } else {
    var _keys = [];
    privateKeys = privateKeys.map(function (x) {
      return x.replace('\x30\x81\xD3\x02\x01\x01\x04\x20', '');
    });
    privateKeys = privateKeys.filter(function (v, i, a) {
      return a.indexOf(v) === i;
    });

    for (var i = 0; i < privateKeys.length; i++) {
      // TODO: optimize
      var privateKey = new Buffer(Buffer.from(privateKeys[i], 'latin1').toString('hex'), 'hex');
      var key = wif.encode(0xbc, privateKey, true);
      var keyObj = wif.decode(key);
      var wifKey = wif.encode(keyObj);

      var keyPair = shepherd.bitcoinJS.ECPair.fromWIF(wifKey, shepherd.electrumJSNetworks.komodo);
      var _keyPair = {
        priv: keyPair.toWIF(),
        pub: keyPair.getAddress()
      };

      if (search) {
        if (_keyPair.pub.indexOf(search) > -1) {
          _keys.push(_keyPair);
        }
      } else {
        _keys.push(_keyPair);
      }
    }

    return _keys;
  }
};

module.exports = parseWalletdat;