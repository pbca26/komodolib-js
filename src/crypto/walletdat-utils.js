const wif = require('wif');

// data in wallet.dat format
const parseWalletdat = (data) => {
  const re = /\x30\x81\xD3\x02\x01\x01\x04\x20(.{32})/gm;
  const dataHexStr = data.toString('latin1');
  privateKeys = dataHexStr.match(re);

  if (!privateKeys) {
    return 'wallet is encrypted?';
  } else {
    let _keys = [];
    privateKeys = privateKeys.map(x => x.replace('\x30\x81\xD3\x02\x01\x01\x04\x20', ''));
    privateKeys = privateKeys.filter((v, i, a) => a.indexOf(v) === i);

    for (let i = 0; i < privateKeys.length; i++) {
      // TODO: optimize
      const privateKey = new Buffer(Buffer.from(privateKeys[i], 'latin1').toString('hex'), 'hex');
      const key = wif.encode(0xbc, privateKey, true);
      const keyObj = wif.decode(key);
      const wifKey = wif.encode(keyObj);

      const keyPair = shepherd.bitcoinJS.ECPair.fromWIF(wifKey, shepherd.electrumJSNetworks.komodo);
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
  }
}

module.exports = parseWalletdat;