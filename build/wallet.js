'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// TODO: - eth support, electrum/insight connect switch
//       - fix transaction-type send to self case

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
var keyPair = require('./keyPair');
var keyPairMultisig = require('./keyPairMultisig');
var connect = require('./connect');
var transactionType = require('./transaction-type');

var _require2 = require('./transaction-builder'),
    data = _require2.data,
    transaction = _require2.transaction,
    multisig = _require2.multisig;

var txDecoder = require('./transaction-decoder');
var fees = require('./fees');

var _require3 = require('./utils'),
    toSats = _require3.toSats,
    fromSats = _require3.fromSats;

var isCoinActive = function isCoinActive(name, wallet) {
  if (!wallet.coins[name]) {
    throw new Error('Coin is not active');
  }
};

var wallet = function () {
  function wallet() {
    _classCallCheck(this, wallet);

    this.privKey = null;
    this.redeemScript = null;
    this.coins = {};
  }

  _createClass(wallet, [{
    key: 'setMainPrivKey',
    value: function setMainPrivKey(key, redeemScript) {
      this.privKey = key;

      if (redeemScript) {
        this.redeemScript = redeemScript;
      }
    }
  }, {
    key: 'addCoin',
    value: function addCoin(name) {
      if (!name || !networks[name] || name === 'btc') {
        throw new Error('Wrong coin name');
      }

      if (!this.privKey) {
        throw new Error('Set private key first');
      }

      var c = connect('insight', { server: name });

      this.coins[name] = {
        keys: !this.redeemScript ? new keyPair(this.privKey, name) : new keyPairMultisig(this.privKey, this.redeemScript, name),
        connect: c,
        transactions: {}
      };
    }
  }, {
    key: 'removeCoin',
    value: function removeCoin(name) {
      isCoinActive(name, this);

      delete this.coins[name];
    }

    // get general coin info

  }, {
    key: 'getCoinInfo',
    value: function getCoinInfo(name) {
      isCoinActive(name, this);
    }

    // get tx history

  }, {
    key: 'getHistory',
    value: function getHistory(coin) {
      var _this = this;

      var maxItems = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

      isCoinActive(coin, this);

      return new Promise(function (resolve, reject) {
        _this.coins[coin].connect.getHistory(_this.coins[coin].keys.pub).then(function (res) {
          if (res.hasOwnProperty('txs')) {
            var _txs = res.txs;
            var txs = [];

            for (var i = 0; i < _txs.length; i++) {
              var _parsedTx = {
                format: {
                  txid: _txs[i].txid,
                  version: _txs[i].version,
                  locktime: _txs[i].locktime
                },
                inputs: _txs[i].vin,
                outputs: _txs[i].vout,
                timestamp: _txs[i].time,
                confirmations: _txs[i].confirmations
              };

              var formattedTx = transactionType(_parsedTx, _this.coins[coin].keys.pub, { isKomodo: coin === 'kmd' });

              if (formattedTx.type) {
                formattedTx.blocktime = _parsedTx.timestamp;
                formattedTx.timereceived = _parsedTx.timestamp;
                formattedTx.hex = 'N/A';
                formattedTx.inputs = _parsedTx.inputs;
                formattedTx.outputs = _parsedTx.outputs;
                formattedTx.locktime = _parsedTx.format.locktime;
                txs.push(formattedTx);
              } else {
                formattedTx[0].blocktime = _parsedTx.timestamp;
                formattedTx[0].timereceived = _parsedTx.timestamp;
                formattedTx[0].hex = 'N/A';
                formattedTx[0].inputs = _parsedTx.inputs;
                formattedTx[0].outputs = _parsedTx.outputs;
                formattedTx[0].locktime = _parsedTx.format.locktime;
                formattedTx[1].blocktime = _parsedTx.timestamp;
                formattedTx[1].timereceived = _parsedTx.timestamp;
                formattedTx[1].hex = 'N/A';
                formattedTx[1].inputs = _parsedTx.inputs;
                formattedTx[1].outputs = _parsedTx.outputs;
                formattedTx[1].locktime = _parsedTx.format.locktime;
                txs.push(formattedTx[0]);
                txs.push(formattedTx[1]);
              }
            }

            resolve(txs);
          } else {
            resolve(res);
          }
        });
      });
    }

    // get address balance

  }, {
    key: 'getBalance',
    value: function getBalance(coin) {
      var _this2 = this;

      isCoinActive(coin, this);

      return new Promise(function (resolve, reject) {
        _this2.coins[coin].connect.getBalance(_this2.coins[coin].keys.pub).then(function (res) {
          resolve({
            satoshi: res,
            float: fromSats(res)
          });
        });
      });
    }

    // get transaction

  }, {
    key: 'getTransaction',
    value: function getTransaction(coin, txid) {
      var _this3 = this;

      var maxVins = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 64;

      isCoinActive(coin, this);

      return new Promise(function (resolve, reject) {
        _this3.coins[coin].connect.getTransaction(txid).then(function (res) {
          if (res.hasOwnProperty('txid')) {
            var _parsedTx = {
              format: {
                txid: res.txid,
                version: res.version,
                locktime: res.locktime
              },
              inputs: res.vin,
              outputs: res.vout,
              timestamp: res.time,
              confirmations: res.confirmations
            };

            var formattedTx = transactionType(_parsedTx, _this3.coins[coin].keys.pub, { isKomodo: coin === 'kmd' });

            if (formattedTx.type) {
              formattedTx.blocktime = _parsedTx.timestamp;
              formattedTx.timereceived = _parsedTx.timestamp;
              formattedTx.hex = 'N/A';
              formattedTx.inputs = _parsedTx.inputs;
              formattedTx.outputs = _parsedTx.outputs;
              formattedTx.locktime = _parsedTx.format.locktime;
            } else {
              formattedTx[0].blocktime = _parsedTx.timestamp;
              formattedTx[0].timereceived = _parsedTx.timestamp;
              formattedTx[0].hex = 'N/A';
              formattedTx[0].inputs = _parsedTx.inputs;
              formattedTx[0].outputs = _parsedTx.outputs;
              formattedTx[0].locktime = _parsedTx.format.locktime;
              formattedTx[1].blocktime = _parsedTx.timestamp;
              formattedTx[1].timereceived = _parsedTx.timestamp;
              formattedTx[1].hex = 'N/A';
              formattedTx[1].inputs = _parsedTx.inputs;
              formattedTx[1].outputs = _parsedTx.outputs;
              formattedTx[1].locktime = _parsedTx.format.locktime;
            }

            resolve(formattedTx);
          } else {
            resolve(res);
          }
        });
      });
    }

    // create raw tx

  }, {
    key: 'createTransaction',
    value: function createTransaction(coin, options) {
      var _this4 = this;

      isCoinActive(coin, this);

      return new Promise(function (resolve, reject) {
        _this4.coins[coin].connect.getUTXO(_this4.coins[coin].keys.pub).then(function (res) {
          var utxo = res;
          for (var i = 0; i < utxo.length; i++) {
            utxo[i].value = utxo[i].satoshis;
          }

          var estimate = data(networks[coin], toSats(options.value), fees[coin], options.address, _this4.coins[coin].keys.pub, utxo);

          if (!options.estimate) {
            var rawtx = transaction(options.address, _this4.coins[coin].keys.pub, _this4.coins[coin].keys.wif, networks[coin], estimate.inputs, estimate.change, estimate.value, !_this4.redeemScript ? null : {
              multisig: {
                creator: true,
                redeemScript: _this4.redeemScript
              }
            });

            var decodedTx = txDecoder(rawtx, networks[coin]);

            resolve(decodedTx.format.txid);

            if (!_this4.coins[coin].transactions[decodedTx.format.txid]) {
              _this4.coins[coin].transactions[decodedTx.format.txid] = rawtx;
            }
          }

          resolve(estimate);
        });
      });
    }

    // sign raw tx

  }, {
    key: 'signTransaction',
    value: function signTransaction(coin, txid) {
      isCoinActive(coin, this);
    }

    // broadcast raw tx

  }, {
    key: 'broadcastTransaction',
    value: function broadcastTransaction(coin, txid) {
      var _this5 = this;

      isCoinActive(coin, this);

      if (this.coins[coin].transactions[txid]) {
        return new Promise(function (resolve, reject) {
          _this5.coins[coin].connect.broadcast(_this5.coins[coin].transactions[txid]).then(function (res) {
            if (res.hasOwnProperty('txid')) {
              delete _this5.coins[coin].transactions[txid];
              resolve(txid);
            } else {
              resolve(res);
            }
          });
        });
      } else {
        throw new Error('Wrong txid');
      }
    }

    // return a list of transactions that are not yet broadcasted

  }, {
    key: 'storageTransactions',
    value: function storageTransactions(coin) {
      isCoinActive(coin, this);

      return this.coins[coin].transactions;
    }
  }, {
    key: 'checkSignatures',
    value: function checkSignatures(coin, txid) {
      isCoinActive(coin, this);
    }

    // add rawtx

  }, {
    key: 'addTransaction',
    value: function addTransaction(coin, rawtx) {
      isCoinActive(coin, this);
    }
  }, {
    key: 'dumpToJSON',
    value: function dumpToJSON() {}
  }, {
    key: 'loadFromJSON',
    value: function loadFromJSON() {}
  }]);

  return wallet;
}();

module.exports = wallet;