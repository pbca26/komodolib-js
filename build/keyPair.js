'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// TODO: more convert methods, subclasses(?)

var _require = require('./keys'),
    addressVersionCheck = _require.addressVersionCheck,
    wifToWif = _require.wifToWif,
    seedToWif = _require.seedToWif,
    stringToWif = _require.stringToWif,
    fromWif = _require.fromWif,
    pubkeyToAddress = _require.pubkeyToAddress,
    etherKeys = _require.etherKeys,
    xpub = _require.xpub,
    btcToEthPriv = _require.btcToEthPriv,
    ethToBtcWif = _require.ethToBtcWif,
    ethPrivToPub = _require.ethPrivToPub,
    seedToPriv = _require.seedToPriv,
    pubToElectrumScriptHashHex = _require.pubToElectrumScriptHashHex,
    getAddressVersion = _require.getAddressVersion,
    pubToPub = _require.pubToPub,
    isPrivKey = _require.isPrivKey;

var networks = require('./bitcoinjs-networks-all');

var addressTypes = ['pubHex', 'pubAddress', 'seed', 'btcWif', 'ethPriv'];

var keyPair = function () {
  function keyPair(str) {
    var network = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'kmd';

    _classCallCheck(this, keyPair);

    this.str = str;
    //this.type = type;
    this.network = network;
    this.wif = stringToWif(str, networks[network], true).priv !== stringToWif(str, networks[network], true).pub ? stringToWif(str, networks[network], true).priv : null;
    this.pub = stringToWif(str, networks[network], true).pub;
    this.pubHex = stringToWif(str, networks[network], true).priv !== stringToWif(str, networks[network], true).pub ? stringToWif(str, networks[network], true).pubHex : null;

    /*if (addressTypes.indexOf(type) === -1) {
      throw new Error('wrong address type');
    }*/
  }

  _createClass(keyPair, [{
    key: 'toETHPub',
    value: function toETHPub() {
      if (!this.wif) {
        throw new Error('can\'t convert watchonly address to ETH priv');
      }

      return ethPrivToPub(btcToEthPriv(stringToWif(this.str, networks.btc, true).priv));
    }
  }, {
    key: 'toETHPriv',
    value: function toETHPriv() {
      if (!this.wif) {
        throw new Error('can\'t convert watchonly address to ETH priv');
      }

      return btcToEthPriv(stringToWif(this.str, networks.btc, true).priv);
    }
  }, {
    key: 'toWIF',
    value: function toWIF(network) {
      if (!this.wif) {
        throw new Error('can\'t convert watchonly address to WIF');
      }

      if (network && !networks[network]) {
        throw new Error('wrong network name');
      }

      return stringToWif(this.str, network ? networks[network] : networks[this.network], true).priv;
    }
  }, {
    key: 'toPub',
    value: function toPub(network) {
      if (network && !networks[network]) {
        throw new Error('wrong network name');
      }

      return stringToWif(this.str, network ? networks[network] : networks[this.network], true).pub;
    }
  }, {
    key: 'toPubHex',
    value: function toPubHex(network) {
      if (!this.wif) {
        throw new Error('can\'t convert watchonly address to pub key hex');
      }

      if (network && !networks[network]) {
        throw new Error('wrong network name');
      }

      return stringToWif(this.str, network ? networks[network] : networks[this.network], true).pubHex;
    }
  }, {
    key: 'toElectrumScriptHash',
    value: function toElectrumScriptHash(network) {
      if (network && !networks[network]) {
        throw new Error('wrong network name');
      }

      return pubToElectrumScriptHashHex(this.pub, network ? networks[network] : networks[this.network]);
    }
  }]);

  return keyPair;
}();

module.exports = keyPair;