'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// TODO: more convert methods, subclasses(?)

var _require = require('./keys'),
    stringToWif = _require.stringToWif,
    pubToElectrumScriptHashHex = _require.pubToElectrumScriptHashHex,
    multisig = _require.multisig;

var networks = require('./bitcoinjs-networks-all');

var keyPairMultisig = function () {
  function keyPairMultisig(str, redeemScript) {
    var network = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'kmd';

    _classCallCheck(this, keyPairMultisig);

    this.str = str;
    this.network = network;
    this.wif = stringToWif(str, networks[network], true).priv !== stringToWif(str, networks[network], true).pub ? stringToWif(str, networks[network], true).priv : null;
    this.pub = multisig.redeemScriptToPubAddress(redeemScript, networks[network]);
    this.pubKey = multisig.redeemScriptToScriptPubKey(redeemScript, networks[network]);
    this.redeemScript = {
      raw: redeemScript,
      decoded: multisig.decodeRedeemScript(redeemScript, networks[network])
    };
  }

  _createClass(keyPairMultisig, [{
    key: 'toPub',
    value: function toPub(network) {
      if (network && !networks[network]) {
        throw new Error('wrong network name');
      }

      return multisig.redeemScriptToPubAddress(this.redeemScript, this.network);
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

  return keyPairMultisig;
}();

module.exports = keyPairMultisig;