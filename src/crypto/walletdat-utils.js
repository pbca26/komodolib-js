const wif = require('wif');
const bitcoin = require('bitcoinjs-lib');
const bitcoinNetworks = require('../bitcoinjs-networks');

// data in wallet.dat format
const parseWalletDat = (data, network, search) => {
  const re = /\x30\x81\xD3\x02\x01\x01\x04\x20(.{32})/gm;
  const dataHexStr = data.toString('latin1');
  let privateKeys = dataHexStr.match(re);

  if (!privateKeys) {
    return 'wallet is encrypted or malformed contents';
  }

  const _keys = [];
  privateKeys = privateKeys.map(x => x.replace('\x30\x81\xD3\x02\x01\x01\x04\x20', ''));
  privateKeys = privateKeys.filter((v, i, a) => a.indexOf(v) === i);

  for (let i = 0; i < privateKeys.length; i++) {
    // TODO: optimize
    const privateKey = new Buffer(Buffer.from(privateKeys[i], 'latin1').toString('hex'), 'hex');
    const key = wif.encode(bitcoinNetworks[network || 'kmd'].wif, privateKey, true);
    const keyObj = wif.decode(key);
    const wifKey = wif.encode(keyObj);

    const keyPair = bitcoin.ECPair.fromWIF(wifKey, bitcoinNetworks[network || 'kmd']);
    const _keyPair = {
      priv: keyPair.toWIF(),
      pub: keyPair.getAddress(),
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
};

module.exports = parseWalletDat;
