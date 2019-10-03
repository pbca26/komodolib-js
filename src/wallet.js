// TODO: - eth support, electrum/insight connect switch
//       - fix transaction-type send to self case

const {
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
  ethPrivToPub,
  seedToPriv,
  pubToElectrumScriptHashHex,
  getAddressVersion,
  pubToPub,
  isPrivKey,
} = require('./keys');
const networks = require('./bitcoinjs-networks-all');
const keyPair = require('./keyPair');
const keyPairMultisig = require('./keyPairMultisig');
const connect = require('./connect');
const transactionType = require('./transaction-type');
const {
  data,
  transaction,
  multisig,
} = require('./transaction-builder');
const txDecoder = require('./transaction-decoder');
const fees = require('./fees');

const {
  toSats,
  fromSats,
} = require('./utils');

const isCoinActive = (name, wallet) => {
  if (!wallet.coins[name]) {
    throw new Error('Coin is not active');
  }
};

class wallet {
  constructor() {
    this.privKey = null;
    this.redeemScript = null;
    this.coins = {};
  }

  setMainPrivKey(key, redeemScript) {
    this.privKey = key;

    if (redeemScript) {
      this.redeemScript = redeemScript;
    }
  }

  addCoin(name) {
    if (!name ||
        !networks[name] ||
        name === 'btc') {
      throw new Error('Wrong coin name');
    }

    if (!this.privKey) {
      throw new Error('Set private key first');
    }

    const c = connect('insight', { server: name });
    
    this.coins[name] = {
      keys: !this.redeemScript ? new keyPair(this.privKey, name) : new keyPairMultisig(this.privKey, this.redeemScript, name),
      connect: c,
      transactions: {},
    };
  }

  removeCoin(name) {
    isCoinActive(name, this);
    
    delete this.coins[name];
  }

  // get general coin info
  getCoinInfo(name) {
    isCoinActive(name, this);
  }

  // get tx history
  getHistory(coin, maxItems = 10) {
    isCoinActive(coin, this);

    return new Promise((resolve, reject) => {
      this.coins[coin].connect.getHistory(this.coins[coin].keys.pub)
      .then((res) => {
        if (res.hasOwnProperty('txs')) {
          const _txs = res.txs;
          let txs = [];

          for (let i = 0; i < _txs.length; i++) {
            const _parsedTx = {
              format: {
                txid: _txs[i].txid,
                version: _txs[i].version,
                locktime: _txs[i].locktime,
              },
              inputs: _txs[i].vin,
              outputs: _txs[i].vout,
              timestamp: _txs[i].time,
              confirmations: _txs[i].confirmations,
            };

            const formattedTx = transactionType(
              _parsedTx,
              this.coins[coin].keys.pub,
              { isKomodo: coin === 'kmd' }
            );

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
  getBalance(coin) {
    isCoinActive(coin, this);
    
    return new Promise((resolve, reject) => {
      this.coins[coin].connect.getBalance(this.coins[coin].keys.pub)
      .then((res) => {
        resolve({
          satoshi: res, 
          float: fromSats(res),
        });
      });
    });
  }

  // get transaction
  getTransaction(coin, txid, maxVins = 64) {
    isCoinActive(coin, this);
    
    return new Promise((resolve, reject) => {
      this.coins[coin].connect.getTransaction(txid)
      .then((res) => {
        if (res.hasOwnProperty('txid')) {
          const _parsedTx = {
            format: {
              txid: res.txid,
              version: res.version,
              locktime: res.locktime,
            },
            inputs: res.vin,
            outputs: res.vout,
            timestamp: res.time,
            confirmations: res.confirmations,
          };

          const formattedTx = transactionType(
            _parsedTx,
            this.coins[coin].keys.pub,
            { isKomodo: coin === 'kmd' }
          );

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
  createTransaction(coin, options) {
    isCoinActive(coin, this);
    
    return new Promise((resolve, reject) => {
      this.coins[coin].connect.getUTXO(this.coins[coin].keys.pub)
      .then((res) => {
        let utxo = res;
        for (let i = 0; i < utxo.length; i++) {
          utxo[i].value = utxo[i].satoshis;
        }

        const estimate = data(
          networks[coin],
          toSats(options.value),
          fees[coin],
          options.address,
          this.coins[coin].keys.pub,
          utxo
        );

        if (!options.estimate) {
          const rawtx = transaction(
            options.address,
            this.coins[coin].keys.pub,
            this.coins[coin].keys.wif,
            networks[coin],
            estimate.inputs,
            estimate.change,
            estimate.value,
            !this.redeemScript ? null : {
              multisig: {
                creator: true,
                redeemScript: this.redeemScript,
              }
            }
          );

          const decodedTx = txDecoder(rawtx, networks[coin]);

          resolve(decodedTx.format.txid);
          
          if (!this.coins[coin].transactions[decodedTx.format.txid]) {
            this.coins[coin].transactions[decodedTx.format.txid] = rawtx;
          }
        }

        resolve(estimate);
      });
    });
  }

  // sign raw tx
  signTransaction(coin, txid) {
    isCoinActive(coin, this);
  }

  // broadcast raw tx
  broadcastTransaction(coin, txid) {
    isCoinActive(coin, this);

    if (this.coins[coin].transactions[txid]) {
      return new Promise((resolve, reject) => {
        this.coins[coin].connect.broadcast(this.coins[coin].transactions[txid])
        .then((res) => {
          if (res.hasOwnProperty('txid')) {
            delete this.coins[coin].transactions[txid];
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
  storageTransactions(coin) {
    isCoinActive(coin, this);

    return this.coins[coin].transactions;
  }

  checkSignatures(coin, txid) {
    isCoinActive(coin, this);
  }

  // add rawtx
  addTransaction(coin, rawtx) {
    isCoinActive(coin, this);
  }

  dumpToJSON() {

  }

  loadFromJSON() {

  }
}

module.exports = wallet;