/* TODO: - eth support
 *       - electrum/insight connect switch
 *       - fix transaction-type send to self case
 *       - add event based option
 * This code is WIP
 */ 

const {
  checkPublicAddress,
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
const transactionBuilder = require('./transaction-builder');
const txDecoder = require('./transaction-decoder');
const fees = require('./fees');

/**
 *
 * Async/await synchronous loop
 * 
 * // ref: https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
 * 
 * @param {object} - input array
 * @param {fn} - callback function
 * @returns none
 */
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const {
  toSats,
  fromSats,
} = require('./utils');

const isCoinActive = (name, wallet) => {
  if (!wallet.coins[name]) {
    throw new Error('Coin is not active');
  }
};

/**
 *
 * A high level wallet class
 * Bitcoin forks only
 * BTC is currently unsupported due to a requirement to fetch fees which is yet to be implemented
 * 
 * @param none
 * @returns {object} - instance of a class
 */
class wallet {
  constructor() {
    this.privKey = null;
    this.redeemScript = null;
    this.coins = {};
  }

  /**
   *
   * Set main private key (signing key) method
   * 
   * @param {string} - WIF key
   * @param {string} - WIF key
   * @returns null
   */
  setMainPrivKey(key, redeemScript) {
    this.privKey = key;

    if (redeemScript) {
      this.redeemScript = redeemScript;
    }
  }

  /**
   *
   * Add coin method
   * 
   * @param {string} - network name (bitcoinjs-networks.js)
   * @throws {error}
   *  
   * errors:
   *   (1) if network name is invalid
   *   (2) if private key is not set
   * 
   * @returns null
   */
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

  /**
   *
   * Remove coin method
   * 
   * @param {string} - coin name
   * @throws {error} - if coin is not added yet
   * @returns null
   */
  removeCoin(name) {
    isCoinActive(name, this);
    
    delete this.coins[name];
  }

  /**
   *
   * Get general coin info method
   * 
   * TODO: implement
   * 
   * @param {string} - coin name
   * @throws {error} - if coin is not added yet
   * @returns null
   */
  getCoinInfo(name) {
    isCoinActive(name, this);
  }

  /**
   *
   * Get transaction history method
   * 
   * @param {string} - coin name
   * @param {number} - (optional) transaction history length
   * @throws {error} - if coin is not added yet
   * @returns {array} - data is returned in a fromat similar to Bitcoin full node listtransactions method response
   */
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

  /**
   *
   * Get address balance method
   * 
   * @param {string} - coin name
   * @throws {error} - if coin is not added yet
   * @returns {object} - balance is returned in satoshis and in float
   */
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

  /**
   *
   * Get transaction method
   * 
   * @param {string} - coin name
   * @param {string} - transaction ID
   * @throws {error} - if coin is not added yet
   * @returns {promise} - array, data is returned in a fromat similar to Bitcoin full node gettransaction method response
   */
  getTransaction(coin, txid) {
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

  /**
   *
   * Create transaction method
   * 
   * @param {string} - coin name
   * @param {number} - spend value in float
   * @param {string} - public address
   * @param {object}
   *  options:
   *   @param {bool}   estimate - return only calculated transaction input data
   * @throws {error} - if coin is not added yet
   * @returns {promise} - string, transaction ID
   */
  createTransaction(coin, value, address, options) {
    isCoinActive(coin, this);
    
    return new Promise((resolve, reject) => {
      this.coins[coin].connect.getUTXO(this.coins[coin].keys.pub)
      .then((res) => {
        let utxo = res;
        for (let i = 0; i < utxo.length; i++) {
          utxo[i].value = utxo[i].satoshis;
        }

        const estimate = transactionBuilder.data(
          networks[coin],
          toSats(value),
          fees[coin],
          address,
          this.coins[coin].keys.pub,
          utxo
        );

        if (!options || (options && !options.estimate)) {
          const rawtx = transactionBuilder.transaction(
            address,
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
                incomplete: this.coins[coin].keys.redeemScript.decoded.m > 1,
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

  /**
   *
   * Sign multisignature transaction method
   * 
   * @param {string} - coin name
   * @param {string} - transaction ID
   * @throws {error} - if coin is not added yet or transaction ID is invalid/non-existent
   * @returns {promise} - string, transaction ID
   */
  signMultisigTransaction(coin, txid) {
    isCoinActive(coin, this);

    if (this.coins[coin].transactions[txid]) {
      return new Promise((resolve, reject) => {
        const decodedTx = txDecoder(this.coins[coin].transactions[txid], networks[coin]);
        const that = this;
        let utxo = [];

        (async () => {
          await asyncForEach(decodedTx.inputs, async (vin, index) => {
            const utxoItem = await that.coins[coin].connect.getTransaction(vin.txid);
            
            if (utxoItem.hasOwnProperty('txid')) {              
              utxo.push({
                value: toSats(utxoItem.vout[vin.n].value),
                txid: vin.txid,
                height: utxoItem.height,
                vout: vin.n,
              });
            } else {
              reject(Error(`Unable to get input ${vin.txid}`));
            }            
          });

          const signatures = transactionBuilder.multisig.checkSignatures(
            utxo,
            this.coins[coin].transactions[txid],
            this.redeemScript,
            networks[coin]
          ).signatures;

          if (signatures &&
              signatures.verified) {
            const rawtx = transactionBuilder.multisig.sign(
              this.coins[coin].keys.wif,
              networks[coin],
              utxo,
              !this.redeemScript ? null : {
                multisig: {
                  redeemScript: this.redeemScript,
                  incomplete: signatures && signatures.verified !== signatures.required - 1,
                  rawtx: this.coins[coin].transactions[txid],
                },
              }
            );

            this.coins[coin].transactions[txid] = rawtx;
            resolve(txid);
          } else {
            throw new Error('Unable to parse signatures from rawtx');
          }
        })();
      });
    } else {
      throw new Error('Wrong txid');
    }
  }

  /**
   *
   * Broadcast transaction from storage method
   * 
   * @param {string} - coin name
   * @param {string} - transaction ID
   * @throws {error} - if coin is not added yet or transaction ID is invalid/non-existent
   * @returns {promise} - string, transaction ID
   */
  broadcastTransaction(coin, txid) {
    isCoinActive(coin, this);

    if (this.coins[coin].transactions[txid]) {
      return new Promise((resolve, reject) => {
        this.coins[coin].connect.broadcast(this.coins[coin].transactions[txid])
        .then((res) => {
          if (res.hasOwnProperty('txid')) {
            delete this.coins[coin].transactions[txid];
            resolve(res.txid);
          } else {
            resolve(res);
          }
        });
      });
    } else {
      throw new Error('Wrong txid');
    }
  }

  /**
   *
   * Get transactions from storage method
   * Returns a list of transactions that are not yet broadcasted
   * 
   * @param {string} - coin name
   * @returns {array}
   */
  storageTransactions(coin) {
    isCoinActive(coin, this);

    return this.coins[coin].transactions;
  }

  /**
   *
   * Check transaction signature method
   * 
   * TODO: implement
   * 
   * @param {string} - coin name
   * @param {string} - transaction ID
   * @throws {error} - if coin is not added yet
   * @returns null
   */
  checkSignatures(coin, txid) {
    isCoinActive(coin, this);
  }

  /**
   *
   * Add transaction to storage from raw hex method
   * 
   * @param {string} - coin name
   * @param {string} - raw transaction hex
   * @throws {error} - if coin is not added yet
   * @returns null
   */
  addTransaction(coin, rawtx) {
    isCoinActive(coin, this);

    if (rawtx) {
      const decodedTx = txDecoder(rawtx, networks[coin]);

      this.coins[coin].transactions[decodedTx.format.txid] = rawtx;
      return decodedTx.format.txid;
    } else {
      throw new Error('Wrong txid');
    }
  }

  /**
   *
   * Dump wallet
   * 
   * @param none
   * @returns {object}
   */
  dumpToJSON() {
    return JSON.stringify({
      coins: this.coins,
      privData: {
        privKey: this.privKey,
        redeemScript: this.redeemScript,
      },
    });
  }

  /**
   *
   * Load wallet from JSON dump data
   * 
   * @param {string} - coin name
   * @param {string} - raw transaction hex
   * @throws {error} - if provided JSON is invalid or wallet format is invalid
   * @returns null
   */
  loadFromJSON(json) {
    try {
      json = JSON.parse(json);

      if (json.hasOwnProperty('coins') &&
          json.hasOwnProperty('privData')) {
        this.coins = json.coins;
        this.setMainPrivKey(json.privData.privKey, json.privData.redeemScript);
      } else {
        throw new Error('Invalid wallet dump format');
      }
    } catch(e) {
      throw new Error('Invalid JSON');
    }
  }
}

module.exports = wallet;