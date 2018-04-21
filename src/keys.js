const sha256 = require('js-sha256');
const crypto = require('crypto');
const bigi = require('bigi');
const bitcoinZcash = require('bitcoinjs-lib-zcash');
const bitcoin = require('bitcoinjs-lib');
const bitcoinPos = require('bitcoinjs-lib-pos');
const bs58check = require('bs58check');
const bip39 = require('bip39');

const addressVersionCheck = (network, address) => {
  try {
    const _b58check = network.isZcash ? bitcoinZcash.address.fromBase58Check(address) : bitcoin.address.fromBase58Check(address);

    if (_b58check.version === network.pubKeyHash ||
        _b58check.version === network.scriptHash) {
      return true;
    } else {
      return false;
    }
  } catch(e) {
    return 'Invalid pub address';
  }
}

const wifToWif = (wif, network) => {
  let key;

  if (network.isZcash) {
    key = new bitcoinZcash.ECPair.fromWIF(wif, network, true);
  } else {
    key = new bitcoin.ECPair.fromWIF(wif, network, true);
  }

  return {
    pub: key.getAddress(),
    priv: key.toWIF(),
  };
}

const seedToWif = (seed, network, iguana) => {
  const hash = sha256.create().update(seed);
  let bytes = hash.array();

  if (iguana) {
    bytes[0] &= 248;
    bytes[31] &= 127;
    bytes[31] |= 64;
  }

  const d = bigi.fromBuffer(bytes);
  let keyPair;

  if (network.isZcash) {
    keyPair = new bitcoinZcash.ECPair(d, null, { network });
  } else {
    keyPair = new bitcoin.ECPair(d, null, { network });
  }

  const keys = {
    pub: keyPair.getAddress(),
    priv: keyPair.toWIF(),
  };

  return keys;
}

// login like function
const stringToWif = (string, network, iguana) => {
  let _wifError = false;
  let isWif = false;
  let keys;

  // watchonly
  if (string.match('^[a-zA-Z0-9]{34}$')) {
    return {
      priv: string,
      pub: string,
    };
  } else {
    try {
      bs58check.decode(string);
      isWif = true;
    } catch (e) {}

    if (isWif) {
      try {
        if (network.isZcash) {
          key = new bitcoinZcash.ECPair.fromWIF(string, network, true);
        } else {
          key = new bitcoin.ECPair.fromWIF(string, network, true);
        }

        keys = {
          priv: key.toWIF(),
          pub: key.getAddress(),
        };
      } catch (e) {
        _wifError = true;
      }
    } else {
      keys = seedToWif(string, network, iguana);
    }
  }

  return _wifError ? 'error' : keys;
}

const bip39Search = (seed, network, matchPattern, addressDepth, accountsCount, includeChangeAddresses, addressDepthOffset, accountCountOffset) => {
  seed = bip39.mnemonicToSeed(seed);
  const hdMaster = bitcoin.HDNode.fromSeedBuffer(seed, network);
  const _defaultAddressDepth = addressDepth;
  const _defaultAccountCount = accountsCount;
  let _addresses = [];
  let _matchingKey = matchPattern ? [] : {};
  accountCountOffset = !accountCountOffset ? 0 : accountCountOffset;
  addressDepthOffset = !addressDepthOffset ? 0 : addressDepthOffset;

  for (let i = Number(accountCountOffset); i < Number(accountCountOffset) + Number(_defaultAccountCount); i++) {
    for (let j = 0; j < (includeChangeAddresses ? 2 : 1); j++) {
      for (let k = Number(addressDepthOffset); k < Number(addressDepthOffset) + Number(_defaultAddressDepth); k++) {
        const _key = hdMaster.derivePath(`m/44'/141'/${i}'/${j}/${k}`);

        if (!matchPattern) {
          _matchingKey.push({
            path: `m/44'/141'/${i}'/${j}/${k}`,
            pub: _key.keyPair.getAddress(),
            priv: _key.keyPair.toWIF(),
          });
        } else {
          if (_key.keyPair.getAddress() === matchPattern) {
            _matchingKey = {
              pub: _key.keyPair.getAddress(),
              priv: _key.keyPair.toWIF(),
            };
          }
        }
      }
    }
  }

  return _matchingKey ? _matchingKey : 'address is not found';
};

module.exports = {
  bip39Search,
  addressVersionCheck,
  wifToWif,
  seedToWif,
  stringToWif,
};