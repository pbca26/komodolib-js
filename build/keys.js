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

// TODO: - grs/emc2 multisig fix
//       - group functions into btc/eth

var addressVersionCheck = function addressVersionCheck(network, address) {
  try {
    var _b58check = void 0;

    if (network && network.isZcash) {
      _b58check = bitcoinZcash.address.fromBase58Check(address);
    } else if (network && network.isGRS) {
      _b58check = groestlcoinjsLib.address.fromBase58Check(address, network);
    } else {
      _b58check = bitcoin.address.fromBase58Check(address);
    }

    if (_b58check.version === network.pubKeyHash || _b58check.version === network.scriptHash) {
      return true;
    }

    return false;
  } catch (e) {
    return 'Invalid pub address';
  }
};

var wifToWif = function wifToWif(_wif, network) {
  var key = void 0;

  if (network && network.isZcash) {
    key = new bitcoinZcash.ECPair.fromWIF(_wif, network, true);
  } else if (network && network.isGRS) {
    var decoded = wif.decode(_wif);
    var d = bigi.fromBuffer(decoded.privateKey);
    key = new groestlcoinjsLib.ECPair(d, null, {
      network: network
    });
  } else {
    if (network && network.hasOwnProperty('compressed') && network.compressed === true) {
      var _decoded = wif.decode(_wif);
      var _d = bigi.fromBuffer(_decoded.privateKey);
      key = new bitcoin.ECPair(_d, null, {
        network: network
      });
    } else {
      key = new bitcoin.ECPair.fromWIF(_wif, network, true);
    }
  }

  return {
    pub: key.getAddress(),
    priv: key.toWIF(),
    pubHex: key.getPublicKeyBuffer().toString('hex')
  };
};

var seedToWif = function seedToWif(seed, network) {
  var iguana = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var isWif = false;

  try {
    bs58check.decode(seed);
    isWif = true;
    throw new Error('provided string is a WIF key or a pub address');
  } catch (e) {
    if (!isWif) {
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
        if (network && network.hasOwnProperty('compressed') && network.compressed === true) {
          keyPair = new bitcoin.ECPair(d, null, {
            compressed: true,
            network: network
          });
        } else {
          keyPair = new bitcoin.ECPair(d, null, { network: network });
        }
      }

      return {
        pub: keyPair.getAddress(),
        priv: keyPair.toWIF(),
        pubHex: keyPair.getPublicKeyBuffer().toString('hex')
      };
    } else {
      throw new Error('provided string is a WIF key');
    }
  }
};

// login like function
var stringToWif = function stringToWif(string, network) {
  var iguana = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var _wifError = false;
  var isWif = false;
  var keys = void 0;

  // watchonly
  if (string.match('^[a-zA-Z0-9]{34}$')) {
    return {
      priv: string,
      pub: string,
      type: 'pub'
    };
  }

  try {
    bs58check.decode(string);
    isWif = true;
  } catch (e) {}

  if (isWif) {
    var key = void 0;

    try {
      if (network && network.isZcash) {
        key = new bitcoinZcash.ECPair.fromWIF(string, network, true);
      } else if (network && network.isGRS) {
        var decoded = wif.decode(string);
        var d = bigi.fromBuffer(decoded.privateKey);
        key = new bitcoin.ECPair(d, null, {
          network: network
        });
      } else {
        if (network && network.hasOwnProperty('compressed') && network.compressed === true) {
          var _decoded2 = wif.decode(string);
          var _d2 = bigi.fromBuffer(_decoded2.privateKey);
          key = new bitcoin.ECPair(_d2, null, {
            network: network
          });
        } else {
          key = new bitcoin.ECPair.fromWIF(string, network, true);
        }
      }

      keys = {
        pub: key.getAddress(),
        priv: key.toWIF(),
        pubHex: key.getPublicKeyBuffer().toString('hex'),
        type: 'wif'
      };
    } catch (e) {
      _wifError = true;
    }
  } else {
    keys = seedToWif(string, network, iguana);
    keys.type = 'seed';
  }

  return _wifError ? 'error' : keys;
};

var bip39Search = function bip39Search(seed, network, options) {
  var hdMaster = bitcoin.HDNode.fromSeedBuffer(bip39.mnemonicToSeed(seed), network);
  var _defaultAddressDepth = options && options.addressDepth || 1;
  var _defaultAccountCount = options && options.accountsCount || 1;
  var accountCountOffset = options && options.accountCountOffset || 0;
  var addressDepthOffset = options && options.addressDepthOffset || 0;
  var _addresses = [];
  var _matchingKey = options && options.hasOwnProperty('address') ? {} : [];

  for (var i = Number(accountCountOffset); i < Number(accountCountOffset) + Number(_defaultAccountCount); i++) {
    for (var j = 0; j < (options && options.hasOwnProperty('includeChangeAddresses') ? 2 : 1); j++) {
      for (var k = Number(addressDepthOffset); k < Number(addressDepthOffset) + Number(_defaultAddressDepth); k++) {
        var _key = hdMaster.derivePath('m/44\'/' + (!network ? 0 : network.bip44) + '\'/' + i + '\'/' + j + '/' + k);

        if (!options || options && !options.hasOwnProperty('address')) {
          _matchingKey.push({
            path: 'm/44\'/' + (!network ? 0 : network.bip44) + '\'/' + i + '\'/' + j + '/' + k,
            pub: _key.keyPair.getAddress(),
            priv: _key.keyPair.toWIF()
          });
        } else if (options && options.hasOwnProperty('address') && _key.keyPair.getAddress() === options.address) {
          _matchingKey = {
            path: 'm/44\'/' + (!network ? 0 : network.bip44) + '\'/' + i + '\'/' + j + '/' + k,
            pub: _key.keyPair.getAddress(),
            priv: _key.keyPair.toWIF()
          };
        }
      }
    }
  }

  return _matchingKey || 'address is not found';
};

var pubkeyToAddress = function pubkeyToAddress(pubkey, network) {
  try {
    var publicKey = Buffer.from(pubkey, 'hex');
    var publicKeyHash = bitcoin.crypto.hash160(publicKey);
    var address = void 0;

    if (network && network.isZcash) {
      address = bitcoinZcash.address.toBase58Check(publicKeyHash, network.pubKeyHash);
    } else if (network && network.isGRS) {
      address = groestlcoinjsLib.address.toBase58Check(publicKeyHash, network.pubKeyHash);
    } else {
      address = bitcoin.address.toBase58Check(publicKeyHash, network.pubKeyHash);
    }

    return address;
  } catch (e) {
    return false;
  }
};

// priv can be a valid priv key or a seed
var etherKeys = function etherKeys(priv) {
  var iguana = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var keyPairOnly = arguments[2];

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

  if (keyPairOnly) {
    return {
      priv: _wallet.signingKey.privateKey,
      pub: _wallet.address
    };
  }

  return _wallet;
};

// https://github.com/bitcoinjs/bitcoinjs-lib/blob/582727f6de251441c75027a6292699b6f1e1b8f2/test/integration/bip32.js#L31
// btc forks only
var xpub = function xpub(seed, options) {
  var _seed = bip39.mnemonicToSeed(seed);
  var node = options && options.network ? bip32.fromSeed(_seed, options.network) : bip32.fromSeed(_seed);
  var string = void 0;

  if (options && options.hasOwnProperty('bip32') && options.bip32 === true) {
    string = node.neutered().toBase58();
  } else {
    if (options && options.network && options.network.bip44) {
      string = node.derivePath('m/44\'/' + options.network.bip44 + '\'' + (options.path ? '/' + options.path : '')).neutered().toBase58();
    } else {
      throw new Error('Missing bip44 property in network params');
    }
  }

  return string;
};

var btcToEthPriv = function btcToEthPriv(_wif) {
  var decodedWif = wif.decode(_wif);
  var ethWallet = new ethersWallet.Wallet(ethUtil.bufferToHex(decodedWif.privateKey));

  return ethWallet.signingKey.privateKey;
};

var ethPrivToPub = function ethPrivToPub(priv) {
  var ethWallet = new ethersWallet.Wallet(ethUtil.bufferToHex(priv));

  return ethWallet.address;
};

var btcToEthKeys = function btcToEthKeys(_wif) {
  var decodedWif = wif.decode(_wif);
  var ethWallet = new ethersWallet.Wallet(ethUtil.bufferToHex(decodedWif.privateKey));

  return {
    priv: ethWallet.signingKey.privateKey,
    pub: ethWallet.address
  };
};

var ethToBtcWif = function ethToBtcWif(priv, network) {
  var buf = ethUtil.toBuffer(priv);
  var d = bigi.fromBuffer(buf);

  if (network && network.isZcash) {
    return new bitcoinZcash.ECPair(d, null, {
      compressed: true,
      network: network
    }).toWIF();
  } else if (network && network.isGRS) {
    return new groestlcoinjsLib.ECPair(d, null, {
      compressed: true,
      network: network
    }).toWIF();
  } else if (network && !network.isZcash && !network.isGRS) {
    return new bitcoin.ECPair(d, null, {
      compressed: true,
      network: network
    }).toWIF();
  } else {
    return new bitcoin.ECPair(d, null, {
      compressed: true,
      network: bitcoinjsNetworks.btc
    }).toWIF();
  }

  return false;
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
var multisigGenerate = function multisigGenerate(requiredSigNum, pubKeys, network) {
  if (!pubKeys || pubKeys.length < requiredSigNum) {
    throw new Error('Error not enough pub keys provided (' + pubKeys.length + ' vs ' + requiredSigNum + ')');
  } else {
    var _pubKeys = pubKeys.map(function (hex) {
      return Buffer.from(hex, 'hex');
    });
    var redeemScript = network && network.isZcash ? bitcoinZcash.script.multisig.output.encode(requiredSigNum, _pubKeys) : bitcoin.script.multisig.output.encode(requiredSigNum, _pubKeys);
    var scriptPubKey = network && network.isZcash ? bitcoinZcash.script.scriptHash.output.encode(bitcoin.crypto.hash160(redeemScript)) : bitcoin.script.scriptHash.output.encode(bitcoin.crypto.hash160(redeemScript));
    var address = network ? network.isZcash ? bitcoinZcash.address.fromOutputScript(scriptPubKey, network) : bitcoin.address.fromOutputScript(scriptPubKey, network) : bitcoin.address.fromOutputScript(scriptPubKey);

    return {
      address: address,
      scriptPubKey: scriptPubKey.toString('hex'),
      redeemScript: redeemScript.toString('hex')
    };
  }
};

var scriptPubKeyToPubAddress = function scriptPubKeyToPubAddress(scriptPubKey, network) {
  return network ? network.isZcash ? bitcoinZcash.address.fromOutputScript(Buffer.from(scriptPubKey, 'hex'), network) : bitcoin.address.fromOutputScript(Buffer.from(scriptPubKey, 'hex'), network) : bitcoin.address.fromOutputScript(Buffer.from(scriptPubKey, 'hex'));
};

var redeemScriptToPubAddress = function redeemScriptToPubAddress(redeemScript, network) {
  var scriptPubKey = network && network.isZcash ? bitcoinZcash.script.scriptHash.output.encode(bitcoin.crypto.hash160(Buffer.from(redeemScript, 'hex'))) : bitcoin.script.scriptHash.output.encode(bitcoin.crypto.hash160(Buffer.from(redeemScript, 'hex')));
  return network ? network.isZcash ? bitcoinZcash.address.fromOutputScript(scriptPubKey, network) : bitcoin.address.fromOutputScript(scriptPubKey, network) : bitcoin.address.fromOutputScript(scriptPubKey);
};

var redeemScriptToScriptPubKey = function redeemScriptToScriptPubKey(redeemScript, network) {
  var scriptPubKey = network && network.isZcash ? bitcoinZcash.script.scriptHash.output.encode(bitcoin.crypto.hash160(Buffer.from(redeemScript, 'hex'))) : bitcoin.script.scriptHash.output.encode(bitcoin.crypto.hash160(Buffer.from(redeemScript, 'hex')));
  return scriptPubKey.toString('hex');
};

var decodeRedeemScript = function decodeRedeemScript(redeemScript, options) {
  var decodedRedeemScript = options && options.network && options.network.isZcash ? bitcoinZcash.script.multisig.output.decode(Buffer.from(redeemScript, 'hex')) : bitcoin.script.multisig.output.decode(Buffer.from(redeemScript, 'hex'));

  if (options && options.hasOwnProperty('toHex') && options.toHex === true) {
    var _pubKeys = decodedRedeemScript.pubKeys;

    for (var i = 0; i < _pubKeys.length; i++) {
      decodedRedeemScript.pubKeys[i] = decodedRedeemScript.pubKeys[i].toString('hex');
    }
  }

  return decodedRedeemScript;
};

// ref: https://github.com/bitcoinjs/bitcoinjs-lib/issues/990
var pubToElectrumScriptHashHex = function pubToElectrumScriptHashHex(address, network) {
  var script = void 0;

  if (network && network.isZcash) {
    script = bitcoinZcash.address.toOutputScript(address, network);
  } else if (network && network.isGRS) {
    script = groestlcoinjsLib.address.toOutputScript(address, network);
  } else {
    script = bitcoin.address.toOutputScript(address, network ? network : bitcoinjsNetworks.btc);
  }

  var hash = bitcoin.crypto.sha256(script);

  return hash.reverse().toString('hex');
};

var getAddressVersion = function getAddressVersion(address) {
  try {
    var _b58check = bitcoinZcash.address.fromBase58Check(address);
    var _items = [];

    for (var key in bitcoinjsNetworks) {
      if (_b58check.version === bitcoinjsNetworks[key].pubKeyHash || _b58check.version === bitcoinjsNetworks[key].scriptHash) {
        if (key !== 'vrsc' && key !== 'komodo') {
          _items.push(key);
        }
      }
    }

    if (_items.length) {
      return {
        coins: _items,
        version: _b58check.version
      };
    } else {
      throw new Error('Invalid pub address or unknown network');
    }
  } catch (e) {
    try {
      var _b58check2 = groestlcoinjsLib.address.fromBase58Check(address, bitcoinjsNetworks.grs);

      return {
        coins: ['grs'],
        version: _b58check2.version
      };
    } catch (e) {
      throw new Error('Invalid pub address or unknown network');
    }
  }
};

var pubToPub = function pubToPub(address, networkSrc, networkDest) {
  var script = void 0;

  if (networkSrc && networkSrc.isZcash) {
    script = bitcoinZcash.address.toOutputScript(address, networkSrc);
  } else if (networkSrc && networkSrc.isGRS) {
    script = groestlcoinjsLib.address.toOutputScript(address, networkSrc);
  } else {
    script = bitcoin.address.toOutputScript(address, networkSrc ? networkSrc : bitcoinjsNetworks.btc);
  }

  if (networkDest && networkDest.isZcash) {
    return bitcoinZcash.address.fromOutputScript(Buffer.from(script, 'hex'), networkDest);
  } else if (networkDest && networkDest.isGRS) {
    return groestlcoinjsLib.address.fromOutputScript(Buffer.from(script, 'hex'), networkDest);
  } else {
    return bitcoin.address.fromOutputScript(Buffer.from(script, 'hex'), networkDest ? networkDest : bitcoinjsNetworks.btc);
  }

  return false;
};

var isPrivKey = function isPrivKey(str) {
  var isPrivKey = false;

  if (ethUtil.isValidPrivate(ethUtil.toBuffer(str))) {
    isPrivKey = true;
  } else {
    try {
      wif.decode(str);
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
  pubkeyToAddress: pubkeyToAddress,
  etherKeys: etherKeys,
  xpub: xpub,
  btcToEthPriv: btcToEthPriv,
  ethToBtcWif: ethToBtcWif,
  ethPrivToPub: ethPrivToPub,
  btcToEthKeys: btcToEthKeys,
  seedToPriv: seedToPriv,
  multisig: {
    generate: multisigGenerate,
    scriptPubKeyToPubAddress: scriptPubKeyToPubAddress,
    redeemScriptToPubAddress: redeemScriptToPubAddress,
    redeemScriptToScriptPubKey: redeemScriptToScriptPubKey,
    decodeRedeemScript: decodeRedeemScript
  },
  pubToElectrumScriptHashHex: pubToElectrumScriptHashHex,
  getAddressVersion: getAddressVersion,
  pubToPub: pubToPub,
  isPrivKey: isPrivKey
};