const sha256 = require('js-sha256');
const crypto = require('crypto');
const bigi = require('bigi');
const bitcoinZcash = require('bitcoinjs-lib-zcash');
const bitcoin = require('bitcoinjs-lib');
const bitcoinPos = require('bitcoinjs-lib-pos');
const bs58check = require('bs58check');
const bip39 = require('bip39');
const bip32 = require('bip32');
const ethersWallet = require('ethers/wallet');
const ethUtil = require('ethereumjs-util');
const wif = require('wif');
const bitcoinjsNetworks = require('./bitcoinjs-networks');

const addressVersionCheck = (network, address) => {
  try {
    const _b58check = network.isZcash ? bitcoinZcash.address.fromBase58Check(address) : bitcoin.address.fromBase58Check(address);

    if (_b58check.version === network.pubKeyHash ||
        _b58check.version === network.scriptHash) {
      return true;
    }
    return false;
  } catch (e) {
    return 'Invalid pub address';
  }
};

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
    pubHex: key.getPublicKeyBuffer().toString('hex'),
  };
};

const seedToWif = (seed, network, iguana) => {
  const hash = sha256.create().update(seed);
  const bytes = hash.array();

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
    pubHex: keyPair.getPublicKeyBuffer().toString('hex'),
  };

  return keys;
};

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
  }
  
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
        pubHex: key.getPublicKeyBuffer().toString('hex'),
      };
    } catch (e) {
      _wifError = true;
    }
  } else {
    keys = seedToWif(string, network, iguana);
  }

  return _wifError ? 'error' : keys;
};

const bip39Search = (seed, network, matchPattern, addressDepth, accountsCount, includeChangeAddresses, addressDepthOffset, accountCountOffset) => {
  seed = bip39.mnemonicToSeed(seed);
  const hdMaster = bitcoin.HDNode.fromSeedBuffer(seed, network);
  const _defaultAddressDepth = addressDepth;
  const _defaultAccountCount = accountsCount;
  const _addresses = [];
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
        } else if (_key.keyPair.getAddress() === matchPattern) {
          _matchingKey = {
            pub: _key.keyPair.getAddress(),
            priv: _key.keyPair.toWIF(),
          };
        }
      }
    }
  }

  return _matchingKey || 'address is not found';
};

// src: https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/src/ecpair.js#L62
const fromWif = (string, network, versionCheck) => {
  const decoded = wif.decode(string);
  const version = decoded.version;

  if (!network) throw new Error('Unknown network version');
  
  if (versionCheck) {
    if (network.wifAlt && version !== network.wif && network.wifAlt.indexOf(version) === -1) throw new Error('Invalid network version');
    if (!network.wifAlt && version !== network.wif) throw new Error('Invalid network version');  
  }

  const d = bigi.fromBuffer(decoded.privateKey);

  const masterKP = network.isZcash ? new bitcoinZcash.ECPair(d, null, {
    compressed: !decoded.compressed,
    network,
  }) : new bitcoin.ECPair(d, null, {
    compressed: !decoded.compressed,
    network,
  });

  if (network.wifAlt) {
    const altKP = [];

    for (let i = 0; i < network.wifAlt.length; i++) {
      const _network = JSON.parse(JSON.stringify(network));
      _network.wif = network.wifAlt[i];

      const _altKP = network.isZcash ? new bitcoinZcash.ECPair(d, null, {
        compressed: !decoded.compressed,
        network: _network,
      }) : new bitcoin.ECPair(d, null, {
        compressed: !decoded.compressed,
        network: _network,
      });

      altKP.push({
        pub: _altKP.getAddress(),
        priv: _altKP.toWIF(),
        version: network.wifAlt[i],
      });
    }

    return {
      inputKey: decoded,
      master: {
        pub: masterKP.getAddress(),
        priv: masterKP.toWIF(),
        version: network.wif,
      },
      alt: altKP,
    };
  }
  return {
    inputKey: decoded,
    master: {
      pub: masterKP.getAddress(),
      priv: masterKP.toWIF(),
      version: network.wif,
    },
  };
};

const pubkeyToAddress = (pubkey, network) => {
  try {
    const publicKey = new Buffer(pubkey, 'hex');
    const publicKeyHash = bitcoin.crypto.hash160(publicKey);
    const address = network.isZcash ? bitcoinZcash.address.toBase58Check(publicKeyHash, network.pubKeyHash) : bitcoin.address.toBase58Check(publicKeyHash, network.pubKeyHash);

    return address;
  } catch (e) {
    return false;
  }
};

// priv can be a valid priv key or a seed
const etherKeys = (priv, iguana) => {
  if (ethUtil.isValidPrivate(ethUtil.toBuffer(priv))) {
    return new ethersWallet.Wallet(priv);
  }

  const hash = sha256.create().update(priv);
  let bytes = hash.array();

  if (iguana) {
    bytes[0] &= 248;
    bytes[31] &= 127;
    bytes[31] |= 64;
  }

  const _wallet = new ethersWallet.Wallet(ethUtil.bufferToHex(bytes));
    
  return _wallet;
};

// https://github.com/bitcoinjs/bitcoinjs-lib/blob/582727f6de251441c75027a6292699b6f1e1b8f2/test/integration/bip32.js#L31
// btc forks only
const xpub = (seed, options) => {
  const _seed = bip39.mnemonicToSeed(seed);
  const node = options && options.network ? bip32.fromSeed(_seed, options.network) : bip32.fromSeed(_seed);
  let string;

  if (options &&
      options.bip32) {
    string = node.neutered().toBase58();
  } else {
    if (options &&
        options.path) {
      string = node.derivePath(options.path).neutered().toBase58();
    } else {
      return 'missing path arg';
    }
  }

  return string;
};

const btcToEthPriv = (_wif) => {
  const decodedWif = wif.decode(_wif);
  const ethWallet = new ethersWallet.Wallet(ethUtil.bufferToHex(decodedWif.privateKey));

  return ethWallet.signingKey.privateKey;
};

const ethToBtcWif = (priv, network) => {
  const buf = ethUtil.toBuffer(priv);
  const d = bigi.fromBuffer(buf);
  let _priv;

  if (network) {
    _priv = network.isZcash ? new bitcoinZcash.ECPair(d, null, {
      compressed: true,
      network,
    }) : new bitcoin.ECPair(d, null, {
      compressed: true,
      network,
    });
  } else {
    _priv = new bitcoin.ECPair(d, null, {
      compressed: true,
      network: bitcoinjsNetworks.btc,
    });
  }

  return _priv.toWIF();
};

const seedToPriv = (string, dest) => {
  try {
    bs58check.decode(string);
    return dest === 'btc' ? string : btcToEthPriv(string);
  } catch (e) {}

  if (ethUtil.isValidPrivate(ethUtil.toBuffer(string))) {
    return dest === 'eth' ? string : ethToBtcWif(string);
  }

  return string;
};

module.exports = {
  bip39Search,
  addressVersionCheck,
  wifToWif,
  seedToWif,
  stringToWif,
  fromWif,
  pubkeyToAddress,
  etherKeys,
  xpub,
  btcToEthPriv,
  ethToBtcWif,
  seedToPriv,
};
