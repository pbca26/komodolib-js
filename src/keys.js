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
const groestlcoinjsLib = require('bitgo-utxo-lib-groestl');

// TODO: - grs/emc2 multisig fix
//       - group functions into btc/eth

const addressVersionCheck = (network, address) => {
  try {
    let _b58check;
    
    if (network &&
        network.isZcash) {
      _b58check = bitcoinZcash.address.fromBase58Check(address);
    } else if (
      network &&
      network.isGRS
    ) {
      _b58check = groestlcoinjsLib.address.fromBase58Check(address, network);
    } else {
      _b58check = bitcoin.address.fromBase58Check(address);
    }

    if (_b58check.version === network.pubKeyHash ||
        _b58check.version === network.scriptHash) {
      return true;
    }

    return false;
  } catch (e) {
    return 'Invalid pub address';
  }
};

const wifToWif = (_wif, network) => {
  let key;

  if (network &&
      network.isZcash) {
    key = new bitcoinZcash.ECPair.fromWIF(_wif, network, true);
  } else if (
    network &&
    network.isGRS
  ) {
    const decoded = wif.decode(_wif);
    const d = bigi.fromBuffer(decoded.privateKey);
    key = new groestlcoinjsLib.ECPair(d, null, {
      network,
    });
  } else {
    if (network &&
        network.hasOwnProperty('compressed') &&
        network.compressed === true) {
      const decoded = wif.decode(_wif);
      const d = bigi.fromBuffer(decoded.privateKey);
      key = new bitcoin.ECPair(d, null, {
        network,
      });
    } else {
      key = new bitcoin.ECPair.fromWIF(_wif, network, true);
    }
  }

  return {
    pub: key.getAddress(),
    priv: key.toWIF(),
    pubHex: key.getPublicKeyBuffer().toString('hex'),
  };
};

const seedToWif = (seed, network, iguana=true) => {
  let isWif = false;

  try {
    bs58check.decode(seed);
    isWif = true;
    throw new Error('provided string is a WIF key or a pub address');
  } catch (e) {
    if (!isWif) {
      const hash = sha256.create().update(seed);
      const bytes = hash.array();

      if (iguana) {
        bytes[0] &= 248;
        bytes[31] &= 127;
        bytes[31] |= 64;
      }

      let d = bigi.fromBuffer(bytes);
      let keyPair;

      if (network &&
          network.isZcash) {
        keyPair = new bitcoinZcash.ECPair(d, null, { network });
      } else if (
        network &&
        network.isGRS
      ) {
        keyPair = new groestlcoinjsLib.ECPair(d, null, { network });
      } else {
        if (network &&
            network.hasOwnProperty('compressed') &&
            network.compressed === true) {
          keyPair = new bitcoin.ECPair(d, null, {
            compressed: true,
            network,
          });
        } else {
          keyPair = new bitcoin.ECPair(d, null, { network });
        }
      }

      return {
        pub: keyPair.getAddress(),
        priv: keyPair.toWIF(),
        pubHex: keyPair.getPublicKeyBuffer().toString('hex'),
      };
    } else {
      throw new Error('provided string is a WIF key');
    }
  }
};

// login like function
const stringToWif = (string, network, iguana=true) => {
  let _wifError = false;
  let isWif = false;
  let keys;

  // watchonly
  if (string.match('^[a-zA-Z0-9]{34}$')) {
    return {
      priv: string,
      pub: string,
      type: 'pub',
    };
  }

  try {
    bs58check.decode(string);
    isWif = true;
  } catch (e) {}

  if (isWif) {
    let key;

    try {
      if (network &&
          network.isZcash) {
        key = new bitcoinZcash.ECPair.fromWIF(string, network, true);
      } else if (
        network &&
        network.isGRS
      ) {
        const decoded = wif.decode(string);
        const d = bigi.fromBuffer(decoded.privateKey);
        key = new bitcoin.ECPair(d, null, {
          network,
        });
      } else {
        if (network &&
            network.hasOwnProperty('compressed') &&
            network.compressed === true) {
          const decoded = wif.decode(string);
          const d = bigi.fromBuffer(decoded.privateKey);
          key = new bitcoin.ECPair(d, null, {
            network,
          });
        } else {
          key = new bitcoin.ECPair.fromWIF(string, network, true);
        }
      }

      keys = {
        pub: key.getAddress(),
        priv: key.toWIF(),
        pubHex: key.getPublicKeyBuffer().toString('hex'),
        type: 'wif',
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

const bip39Search = (seed, network, options) => {
  const hdMaster = bitcoin.HDNode.fromSeedBuffer(bip39.mnemonicToSeed(seed), network);
  const _defaultAddressDepth = options && options.addressDepth || 1;
  const _defaultAccountCount = options && options.accountsCount || 1;
  const accountCountOffset = options && options.accountCountOffset || 0;
  const addressDepthOffset = options && options.addressDepthOffset || 0;
  const _addresses = [];
  let _matchingKey = options && options.hasOwnProperty('address') ? {} : [];

  for (let i = Number(accountCountOffset); i < Number(accountCountOffset) + Number(_defaultAccountCount); i++) {
    for (let j = 0; j < (options && options.hasOwnProperty('includeChangeAddresses') ? 2 : 1); j++) {
      for (let k = Number(addressDepthOffset); k < Number(addressDepthOffset) + Number(_defaultAddressDepth); k++) {
        const _key = hdMaster.derivePath(`m/44'/${!network ? 0 : network.bip44}'/${i}'/${j}/${k}`);

        if (!options ||
           (options && !options.hasOwnProperty('address'))) {
          _matchingKey.push({
            path: `m/44'/${!network ? 0 : network.bip44}'/${i}'/${j}/${k}`,
            pub: _key.keyPair.getAddress(),
            priv: _key.keyPair.toWIF(),
          });
        } else if (
          options &&
          options.hasOwnProperty('address') &&
          _key.keyPair.getAddress() === options.address
        ) {
          _matchingKey = {
            path: `m/44'/${!network ? 0 : network.bip44}'/${i}'/${j}/${k}`,
            pub: _key.keyPair.getAddress(),
            priv: _key.keyPair.toWIF(),
          };
        }
      }
    }
  }

  return _matchingKey || 'address is not found';
};

const pubkeyToAddress = (pubkey, network) => {
  try {
    const publicKey = Buffer.from(pubkey, 'hex');
    const publicKeyHash = bitcoin.crypto.hash160(publicKey);
    let address;
    
    if (network &&
        network.isZcash) {
      address = bitcoinZcash.address.toBase58Check(publicKeyHash, network.pubKeyHash);
    } else if (
      network &&
      network.isGRS
    ) {
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
const etherKeys = (priv, iguana=true, keyPairOnly) => {
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

  if (keyPairOnly) {
    return {
      priv: _wallet.signingKey.privateKey,
      pub: _wallet.address,
    };
  }
    
  return _wallet;
};

// https://github.com/bitcoinjs/bitcoinjs-lib/blob/582727f6de251441c75027a6292699b6f1e1b8f2/test/integration/bip32.js#L31
// btc forks only
const xpub = (seed, options) => {
  const _seed = bip39.mnemonicToSeed(seed);
  const node = options && options.network ? bip32.fromSeed(_seed, options.network) : bip32.fromSeed(_seed);
  let string;

  if (options &&
      options.hasOwnProperty('bip32') &&
      options.bip32 === true) {
    string = node.neutered().toBase58();
  } else {
    if (options &&
        options.network &&
        options.network.bip44) {
      string = node.derivePath(`m/44'/${options.network.bip44}'${options.path ? '/' + options.path : ''}`).neutered().toBase58();
    } else {
      throw new Error('Missing bip44 property in network params');
    }
  }

  return string;
};

const btcToEthPriv = (_wif) => {
  const decodedWif = wif.decode(_wif);
  const ethWallet = new ethersWallet.Wallet(ethUtil.bufferToHex(decodedWif.privateKey));

  return ethWallet.signingKey.privateKey;
};

const ethPrivToPub = (priv) => {
  const ethWallet = new ethersWallet.Wallet(ethUtil.bufferToHex(priv));

  return ethWallet.address;
};

const btcToEthKeys = (_wif) => {
  const decodedWif = wif.decode(_wif);
  const ethWallet = new ethersWallet.Wallet(ethUtil.bufferToHex(decodedWif.privateKey));

  return {
    priv: ethWallet.signingKey.privateKey,
    pub: ethWallet.address,
  };
};

const ethToBtcWif = (priv, network) => {
  const buf = ethUtil.toBuffer(priv);
  const d = bigi.fromBuffer(buf);

  if (network &&
      network.isZcash) {
    return new bitcoinZcash.ECPair(d, null, {
      compressed: true,
      network,
    })
    .toWIF();
   } else if (
    network &&
    network.isGRS
  ) {
    return new groestlcoinjsLib.ECPair(d, null, {
      compressed: true,
      network,
    })
    .toWIF();
  } else if (
    network &&
    !network.isZcash &&
    !network.isGRS
  ) {
    return new bitcoin.ECPair(d, null, {
      compressed: true,
      network,
    })
    .toWIF();
  } else {
    return new bitcoin.ECPair(d, null, {
      compressed: true,
      network: bitcoinjsNetworks.btc,
    })
    .toWIF();
  }

  return false;
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

// pubKeys - array containing pub key hash hex
// note: likely won't work for PoS lib
const multisigGenerate = (requiredSigNum, pubKeys, network) => {
  if (!pubKeys ||
      pubKeys.length < requiredSigNum) {
    throw new Error(`Error not enough pub keys provided (${pubKeys.length} vs ${requiredSigNum})`);
  } else {
    const _pubKeys = pubKeys.map((hex) => Buffer.from(hex, 'hex'));
    const redeemScript = network && network.isZcash ? bitcoinZcash.script.multisig.output.encode(requiredSigNum, _pubKeys) : bitcoin.script.multisig.output.encode(requiredSigNum, _pubKeys);
    const scriptPubKey = network && network.isZcash ? bitcoinZcash.script.scriptHash.output.encode(bitcoin.crypto.hash160(redeemScript)) : bitcoin.script.scriptHash.output.encode(bitcoin.crypto.hash160(redeemScript));
    const address = network ? network.isZcash ? bitcoinZcash.address.fromOutputScript(scriptPubKey, network) : bitcoin.address.fromOutputScript(scriptPubKey, network) : bitcoin.address.fromOutputScript(scriptPubKey);

    return {
      address,
      scriptPubKey: scriptPubKey.toString('hex'),
      redeemScript: redeemScript.toString('hex'),
    };
  }
}

const scriptPubKeyToPubAddress = (scriptPubKey, network) => {
  return network ? network.isZcash ? bitcoinZcash.address.fromOutputScript(Buffer.from(scriptPubKey, 'hex'), network) : bitcoin.address.fromOutputScript(Buffer.from(scriptPubKey, 'hex'), network) : bitcoin.address.fromOutputScript(Buffer.from(scriptPubKey, 'hex'));
};

const redeemScriptToPubAddress = (redeemScript, network) => {
  const scriptPubKey = network && network.isZcash ? bitcoinZcash.script.scriptHash.output.encode(bitcoin.crypto.hash160(Buffer.from(redeemScript, 'hex'))) : bitcoin.script.scriptHash.output.encode(bitcoin.crypto.hash160(Buffer.from(redeemScript, 'hex')));
  return network ? network.isZcash ? bitcoinZcash.address.fromOutputScript(scriptPubKey, network) : bitcoin.address.fromOutputScript(scriptPubKey, network) : bitcoin.address.fromOutputScript(scriptPubKey);
};

const redeemScriptToScriptPubKey = (redeemScript, network) => {
  const scriptPubKey = network && network.isZcash ? bitcoinZcash.script.scriptHash.output.encode(bitcoin.crypto.hash160(Buffer.from(redeemScript, 'hex'))) : bitcoin.script.scriptHash.output.encode(bitcoin.crypto.hash160(Buffer.from(redeemScript, 'hex')));
  return scriptPubKey.toString('hex');
};

const decodeRedeemScript = (redeemScript, options) => {
  let decodedRedeemScript = options && options.network && options.network.isZcash ? bitcoinZcash.script.multisig.output.decode(Buffer.from(redeemScript, 'hex')) : bitcoin.script.multisig.output.decode(Buffer.from(redeemScript, 'hex'));

  if (options &&
      options.hasOwnProperty('toHex') &&
      options.toHex === true) {
    const _pubKeys = decodedRedeemScript.pubKeys;

    for (let i = 0; i < _pubKeys.length; i++) {
      decodedRedeemScript.pubKeys[i] = decodedRedeemScript.pubKeys[i].toString('hex');
    }
  }

  return decodedRedeemScript;
};

// ref: https://github.com/bitcoinjs/bitcoinjs-lib/issues/990
const pubToElectrumScriptHashHex = (address, network) => {
  let script;
  
  if (network &&
      network.isZcash) {
    script = bitcoinZcash.address.toOutputScript(address, network);
  } else if (
    network &&
    network.isGRS
  ) {
    script = groestlcoinjsLib.address.toOutputScript(address, network);
  } else {
    script = bitcoin.address.toOutputScript(address, network ? network : bitcoinjsNetworks.btc);
  }
  
  const hash = bitcoin.crypto.sha256(script);

  return hash.reverse().toString('hex');
};

const getAddressVersion = (address) => {
  try {
    const _b58check = bitcoinZcash.address.fromBase58Check(address);
    let _items = [];

    for (let key in bitcoinjsNetworks) {
      if (_b58check.version === bitcoinjsNetworks[key].pubKeyHash ||
          _b58check.version === bitcoinjsNetworks[key].scriptHash) {
        if (key !== 'vrsc' &&
            key !== 'komodo') {
          _items.push(key);
        }
      }
    }

    if (_items.length) {
      return {
        coins: _items,
        version: _b58check.version,
      };
    } else {
      throw new Error('Invalid pub address or unknown network');
    }
  } catch (e) {
    try {
      const _b58check = groestlcoinjsLib.address.fromBase58Check(address, bitcoinjsNetworks.grs);
      
      return {
        coins: ['grs'],
        version: _b58check.version,
      };
    } catch (e) {
      throw new Error('Invalid pub address or unknown network');
    }
  }
};

const pubToPub = (address, networkSrc, networkDest) => {
  let script;
  
  if (networkSrc &&
      networkSrc.isZcash) {
    script = bitcoinZcash.address.toOutputScript(address, networkSrc);
  } else if (
    networkSrc &&
    networkSrc.isGRS
  ) {
    script = groestlcoinjsLib.address.toOutputScript(address, networkSrc);
  } else {
    script = bitcoin.address.toOutputScript(address, networkSrc ? networkSrc : bitcoinjsNetworks.btc);
  }

  if (networkDest &&
      networkDest.isZcash) {
    return bitcoinZcash.address.fromOutputScript(Buffer.from(script, 'hex'), networkDest);
  } else if (
    networkDest &&
    networkDest.isGRS
  ) {
    return groestlcoinjsLib.address.fromOutputScript(Buffer.from(script, 'hex'), networkDest);
  } else {
    return bitcoin.address.fromOutputScript(Buffer.from(script, 'hex'), networkDest ? networkDest : bitcoinjsNetworks.btc);
  }

  return false;
};

const isPrivKey = (str) => {
  let isPrivKey = false;

  if (ethUtil.isValidPrivate(ethUtil.toBuffer(str))) {
    isPrivKey = true;
  } else {
    try {
      wif.decode(str);
      isPrivKey = true;
    } catch (e) {}
  }

  return isPrivKey;
}

module.exports = {
  bip39Search,
  addressVersionCheck,
  wifToWif,
  seedToWif,
  stringToWif,
  pubkeyToAddress,
  etherKeys,
  xpub,
  btcToEthPriv,
  ethToBtcWif,
  ethPrivToPub,
  btcToEthKeys,
  seedToPriv,
  multisig: {
    generate: multisigGenerate,
    scriptPubKeyToPubAddress,
    redeemScriptToPubAddress,
    redeemScriptToScriptPubKey,
    decodeRedeemScript,
  },
  pubToElectrumScriptHashHex,
  getAddressVersion,
  pubToPub,
  isPrivKey,
};