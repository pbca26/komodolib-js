'use strict';

var sha256 = require('js-sha256');
var crypto = require('crypto');
var bigi = require('bigi');
var bitcoinZcash = require('bitcoinjs-lib-zcash');
var bitcoin = require('bitcoinjs-lib');
var bitcoinPos = require('bitcoinjs-lib-pos');
var bs58check = require('bs58check');
var bip39 = require('bip39');
var bip32 = require('bip32');
var ethersWallet = require('ethers/wallet');
var ethUtil = require('ethereumjs-util');
var wif = require('wif');
var bitcoinjsNetworks = require('./bitcoinjs-networks');
var groestlcoinjsLib = require('bitgo-utxo-lib-groestl');

var addressVersionCheck = function addressVersionCheck(network, address) {
  try {
    var _b58check = network.isZcash ? bitcoinZcash.address.fromBase58Check(address) : bitcoin.address.fromBase58Check(address);

    if (_b58check.version === network.pubKeyHash || _b58check.version === network.scriptHash) {
      return true;
    }
    return false;
  } catch (e) {
    return 'Invalid pub address';
  }
};

var wifToWif = function wifToWif(wif, network) {
  var key = void 0;

  if (network && network.isZcash) {
    key = new bitcoinZcash.ECPair.fromWIF(wif, network, true);
  } else if (network && network.isGRS) {
    keyPair = new groestlcoinjsLib.ECPair.fromWIF(wif, network, true);
  } else {
    key = new bitcoin.ECPair.fromWIF(wif, network, true);
  }

  return {
    pub: key.getAddress(),
    priv: key.toWIF(),
    pubHex: key.getPublicKeyBuffer().toString('hex')
  };
};

var seedToWif = function seedToWif(seed, network, iguana) {
  var hash = sha256.create().update(seed);
  var bytes = hash.array();

  if (iguana) {
    bytes[0] &= 248;
    bytes[31] &= 127;
    bytes[31] |= 64;
  }

  var d = bigi.fromBuffer(bytes);
  var keyPair = void 0;

  if (network && network.isZcash) {
    keyPair = new bitcoinZcash.ECPair(d, null, { network: network });
  } else if (network && network.isGRS) {
    keyPair = new groestlcoinjsLib.ECPair(d, null, { network: network });
  } else {
    keyPair = new bitcoin.ECPair(d, null, { network: network });
  }

  var keys = {
    pub: keyPair.getAddress(),
    priv: keyPair.toWIF(),
    pubHex: keyPair.getPublicKeyBuffer().toString('hex')
  };

  return keys;
};

// login like function
var stringToWif = function stringToWif(string, network, iguana) {
  var _wifError = false;
  var isWif = false;
  var keys = void 0;

  // watchonly
  if (string.match('^[a-zA-Z0-9]{34}$')) {
    return {
      priv: string,
      pub: string
    };
  }

  try {
    bs58check.decode(string);
    isWif = true;
  } catch (e) {}

  if (isWif) {
    try {
      if (network && network.isZcash) {
        key = new bitcoinZcash.ECPair.fromWIF(string, network, true);
      } else if (network && network.isGRS) {
        keyPair = new groestlcoinjsLib.ECPair.fromWIF(string, network, true);
      } else {
        key = new bitcoin.ECPair.fromWIF(string, network, true);
      }

      keys = {
        priv: key.toWIF(),
        pub: key.getAddress(),
        pubHex: key.getPublicKeyBuffer().toString('hex')
      };
    } catch (e) {
      _wifError = true;
    }
  } else {
    keys = seedToWif(string, network, iguana);
  }

  return _wifError ? 'error' : keys;
};

var bip39Search = function bip39Search(seed, network, matchPattern, addressDepth, accountsCount, includeChangeAddresses, addressDepthOffset, accountCountOffset) {
  seed = bip39.mnemonicToSeed(seed);
  var hdMaster = bitcoin.HDNode.fromSeedBuffer(seed, network);
  var _defaultAddressDepth = addressDepth;
  var _defaultAccountCount = accountsCount;
  var _addresses = [];
  var _matchingKey = matchPattern ? [] : {};
  accountCountOffset = !accountCountOffset ? 0 : accountCountOffset;
  addressDepthOffset = !addressDepthOffset ? 0 : addressDepthOffset;

  for (var i = Number(accountCountOffset); i < Number(accountCountOffset) + Number(_defaultAccountCount); i++) {
    for (var j = 0; j < (includeChangeAddresses ? 2 : 1); j++) {
      for (var k = Number(addressDepthOffset); k < Number(addressDepthOffset) + Number(_defaultAddressDepth); k++) {
        var _key = hdMaster.derivePath('m/44\'/141\'/' + i + '\'/' + j + '/' + k);

        if (!matchPattern) {
          _matchingKey.push({
            path: 'm/44\'/141\'/' + i + '\'/' + j + '/' + k,
            pub: _key.keyPair.getAddress(),
            priv: _key.keyPair.toWIF()
          });
        } else if (_key.keyPair.getAddress() === matchPattern) {
          _matchingKey = {
            pub: _key.keyPair.getAddress(),
            priv: _key.keyPair.toWIF()
          };
        }
      }
    }
  }

  return _matchingKey || 'address is not found';
};

// src: https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/src/ecpair.js#L62
var fromWif = function fromWif(string, network, versionCheck) {
  var decoded = wif.decode(string);
  var version = decoded.version;

  if (!network) throw new Error('Unknown network version');

  if (versionCheck) {
    if (network.wifAlt && version !== network.wif && network.wifAlt.indexOf(version) === -1) throw new Error('Invalid network version');
    if (!network.wifAlt && version !== network.wif) throw new Error('Invalid network version');
  }

  var d = bigi.fromBuffer(decoded.privateKey);

  var masterKP = network.isZcash ? new bitcoinZcash.ECPair(d, null, {
    compressed: !decoded.compressed,
    network: network
  }) : new bitcoin.ECPair(d, null, {
    compressed: !decoded.compressed,
    network: network
  });

  if (network.wifAlt) {
    var altKP = [];

    for (var i = 0; i < network.wifAlt.length; i++) {
      var _network = JSON.parse(JSON.stringify(network));
      _network.wif = network.wifAlt[i];

      var _altKP = network.isZcash ? new bitcoinZcash.ECPair(d, null, {
        compressed: !decoded.compressed,
        network: _network
      }) : new bitcoin.ECPair(d, null, {
        compressed: !decoded.compressed,
        network: _network
      });

      altKP.push({
        pub: _altKP.getAddress(),
        priv: _altKP.toWIF(),
        version: network.wifAlt[i]
      });
    }

    return {
      inputKey: decoded,
      master: {
        pub: masterKP.getAddress(),
        priv: masterKP.toWIF(),
        version: network.wif
      },
      alt: altKP
    };
  }
  return {
    inputKey: decoded,
    master: {
      pub: masterKP.getAddress(),
      priv: masterKP.toWIF(),
      version: network.wif
    }
  };
};

var pubkeyToAddress = function pubkeyToAddress(pubkey, network) {
  try {
    var publicKey = new Buffer(pubkey, 'hex');
    var publicKeyHash = bitcoin.crypto.hash160(publicKey);
    var address = network.isZcash ? bitcoinZcash.address.toBase58Check(publicKeyHash, network.pubKeyHash) : bitcoin.address.toBase58Check(publicKeyHash, network.pubKeyHash);

    return address;
  } catch (e) {
    return false;
  }
};

// priv can be a valid priv key or a seed
var etherKeys = function etherKeys(priv, iguana) {
  if (ethUtil.isValidPrivate(ethUtil.toBuffer(priv))) {
    return new ethersWallet.Wallet(priv);
  }

  var hash = sha256.create().update(priv);
  var bytes = hash.array();

  if (iguana) {
    bytes[0] &= 248;
    bytes[31] &= 127;
    bytes[31] |= 64;
  }

  var _wallet = new ethersWallet.Wallet(ethUtil.bufferToHex(bytes));

  return _wallet;
};

// https://github.com/bitcoinjs/bitcoinjs-lib/blob/582727f6de251441c75027a6292699b6f1e1b8f2/test/integration/bip32.js#L31
// btc forks only
var xpub = function xpub(seed, options) {
  var _seed = bip39.mnemonicToSeed(seed);
  var node = options && options.network ? bip32.fromSeed(_seed, options.network) : bip32.fromSeed(_seed);
  var string = void 0;

  if (options && options.bip32) {
    string = node.neutered().toBase58();
  } else {
    if (options && options.path) {
      string = node.derivePath(options.path).neutered().toBase58();
    } else {
      return 'missing path arg';
    }
  }

  return string;
};

var btcToEthPriv = function btcToEthPriv(_wif) {
  var decodedWif = wif.decode(_wif);
  var ethWallet = new ethersWallet.Wallet(ethUtil.bufferToHex(decodedWif.privateKey));

  return ethWallet.signingKey.privateKey;
};

var ethToBtcWif = function ethToBtcWif(priv, network) {
  var buf = ethUtil.toBuffer(priv);
  var d = bigi.fromBuffer(buf);
  var _priv = void 0;

  if (network) {
    _priv = network.isZcash ? new bitcoinZcash.ECPair(d, null, {
      compressed: true,
      network: network
    }) : new bitcoin.ECPair(d, null, {
      compressed: true,
      network: network
    });
  } else {
    _priv = new bitcoin.ECPair(d, null, {
      compressed: true,
      network: bitcoinjsNetworks.btc
    });
  }

  return _priv.toWIF();
};

var seedToPriv = function seedToPriv(string, dest) {
  try {
    bs58check.decode(string);
    return dest === 'btc' ? string : btcToEthPriv(string);
  } catch (e) {}

  if (ethUtil.isValidPrivate(ethUtil.toBuffer(string))) {
    return dest === 'eth' ? string : ethToBtcWif(string);
  }

  return string;
};

// pubKeys - array containing pub key hash hex
// note: likely won't work for PoS lib
var multisigGenerate = function multisigGenerate(NofN, pubKeys, network) {
  if (!pubKeys || pubKeys.length < NofN) {
    throw 'Error pubKeys length is less than NofN';
  } else {
    var _pubKeys = pubKeys.map(function (hex) {
      return Buffer.from(hex, 'hex');
    });
    var redeemScript = network && network.isZcash ? bitcoinZcash.script.multisig.output.encode(NofN, _pubKeys) : bitcoin.script.multisig.output.encode(NofN, _pubKeys);
    var scriptPubKey = network && network.isZcash ? bitcoinZcash.script.scriptHash.output.encode(bitcoin.crypto.hash160(redeemScript)) : bitcoin.script.scriptHash.output.encode(bitcoin.crypto.hash160(redeemScript));
    var address = network ? network.isZcash ? bitcoinZcash.address.fromOutputScript(scriptPubKey, network) : bitcoin.address.fromOutputScript(scriptPubKey, network) : bitcoin.address.fromOutputScript(scriptPubKey);

    return {
      address: address,
      scriptPubKey: scriptPubKey.toString('hex'),
      redeemScript: redeemScript.toString('hex')
    };
  }
};

var redeemScriptToPubAddress = function redeemScriptToPubAddress(scriptPubKey, network) {
  return network ? network.isZcash ? bitcoinZcash.address.fromOutputScript(Buffer.from(scriptPubKey, 'hex'), network) : bitcoin.address.fromOutputScript(Buffer.from(scriptPubKey, 'hex'), network) : bitcoin.address.fromOutputScript(Buffer.from(scriptPubKey, 'hex'));
};

var decodeRedeemScript = function decodeRedeemScript(redeemScript, options) {
  var decodedRedeemScript = options && options.network && options.network.isZcash ? bitcoinZcash.script.multisig.output.decode(Buffer.from(redeemScript, 'hex')) : bitcoin.script.multisig.output.decode(Buffer.from(redeemScript, 'hex'));

  if (options.toHex) {
    var _pubKeys = decodedRedeemScript.pubKeys;

    for (var i = 0; i < _pubKeys.length; i++) {
      decodedRedeemScript.pubKeys[i] = decodedRedeemScript.pubKeys[i].toString('hex');
    }
  }

  return decodedRedeemScript;
};

// ref: https://github.com/bitcoinjs/bitcoinjs-lib/issues/990
var pubToElectrumScriptHashHex = function pubToElectrumScriptHashHex(address, network) {
  var script = network ? network.isZcash ? bitcoinZcash.address.toOutputScript(address, network) : bitcoin.address.toOutputScript(address, network) : bitcoin.address.toOutputScript(address);
  var hash = bitcoin.crypto.sha256(script);
  var reversedHash = new Buffer(hash.reverse());

  return reversedHash.toString('hex');
};

var getAddressVersion = function getAddressVersion(address) {
  try {
    var _b58check = bitcoinZcash.address.fromBase58Check(address);
    var _items = [];

    for (var _key2 in bitcoinjsNetworks) {
      if (_b58check.version === bitcoinjsNetworks[_key2].pubKeyHash || _b58check.version === bitcoinjsNetworks[_key2].scriptHash) {
        if (_key2 !== 'vrsc' && _key2 !== 'komodo') {
          _items.push(_key2);
        }
      }
    }

    return _items.length ? { coins: _items, version: _b58check.version } : 'Unknown or invalid pub address';
  } catch (e) {
    return 'Invalid pub address';
  }
};

var pubToPub = function pubToPub(address, networkSrc, networkDest) {
  var script = networkSrc ? networkSrc.isZcash ? bitcoinZcash.address.toOutputScript(address, networkSrc) : bitcoin.address.toOutputScript(address, networkSrc) : bitcoin.address.toOutputScript(address);
  return networkDest ? networkDest.isZcash ? bitcoinZcash.address.fromOutputScript(Buffer.from(script, 'hex'), networkDest) : bitcoin.address.fromOutputScript(Buffer.from(script, 'hex'), networkDest) : bitcoin.address.fromOutputScript(Buffer.from(script, 'hex'));
};

var isPrivKey = function isPrivKey(str) {
  var isPrivKey = false;

  if (ethUtil.isValidPrivate(ethUtil.toBuffer(str))) {
    isPrivKey = true;
  } else {
    try {
      bs58check.decode(str);
      isPrivKey = true;
    } catch (e) {}
  }

  return isPrivKey;
};

module.exports = {
  bip39Search: bip39Search,
  addressVersionCheck: addressVersionCheck,
  wifToWif: wifToWif,
  seedToWif: seedToWif,
  stringToWif: stringToWif,
  fromWif: fromWif,
  pubkeyToAddress: pubkeyToAddress,
  etherKeys: etherKeys,
  xpub: xpub,
  btcToEthPriv: btcToEthPriv,
  ethToBtcWif: ethToBtcWif,
  seedToPriv: seedToPriv,
  multisig: {
    generate: multisigGenerate,
    redeemScriptToPubAddress: redeemScriptToPubAddress,
    decodeRedeemScript: decodeRedeemScript
  },
  pubToElectrumScriptHashHex: pubToElectrumScriptHashHex,
  getAddressVersion: getAddressVersion,
  pubToPub: pubToPub,
  isPrivKey: isPrivKey
};