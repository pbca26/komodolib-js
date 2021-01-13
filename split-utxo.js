const coin = 'rick';
const keys = require('./src/keys');
const networks = require('./src/bitcoinjs-networks.js');
const privKey = keys.stringToWif('', networks.kmd, true);
const connect = require('./src/connect');
const decoder = require('./src/transaction-decoder');
const {fromSats, toSats} = require('./src/utils');

const bitcoinJSForks = require('bitcoinforksjs-lib');
const bitcoinZcash = require('bitcoinjs-lib-zcash');
const bitcoinPos = require('bitcoinjs-lib-pos');
const bitcoinZcashSapling = require('bitgo-utxo-lib');
const bitcoinJS = require('bitcoinjs-lib');

const utxoSplitPairs = [10];
const utxoSplitPairsCount = 200;

(async function() {
  const c = connect('insight', { server: coin });

  const utxos = await c.getUTXO(privKey.pub);

  // console.log(utxos);

  let largestUTXO = { amount: 0 };
  
  for (let i = 0; i < utxos.length; i++) {
    if (Number(utxos[i].amount) > Number(largestUTXO.amount)) {
      largestUTXO = JSON.parse(JSON.stringify(utxos[i]));
    }
  }
  
  console.log(`largest utxo ${largestUTXO.amount}`);
  console.log(`largest utxo ${largestUTXO.amount}`);
  
  const utxoSize = largestUTXO.amount;
  const targetSizes = utxoSplitPairs;
  const wif = privKey.priv;
  const address = privKey.pub;
  const pairsCount = utxoSplitPairsCount;
  let totalOutSize = 0;
  let _targets = [];
  
  console.log(`total utxos ${pairsCount * targetSizes.length}`);
  console.log(`total pairs ${pairsCount}`);
  console.log(`utxo size ${utxoSize}`);
  console.log(`utxo sizes`);
  console.log(targetSizes);
  
  for (let i = 0; i < pairsCount; i++) {
    for (let j = 0; j < targetSizes.length; j++) {
      console.log(`vout ${_targets.length} ${targetSizes[j]}`);
      _targets.push(parseInt(Number(toSats(targetSizes[j]))));
      totalOutSize += Number(targetSizes[j]);
    }
  }
  
  console.log(`total out size ${totalOutSize}`);
  console.log(`largest utxo size ${largestUTXO.amount}`);
  console.log(`change ${Number(largestUTXO.amount - totalOutSize) - 0.0001 + (largestUTXO.interest ? largestUTXO.interest : 0)}`);
  
  largestUTXO.value = largestUTXO.amountSats;
  
  const payload = {
    wif,
    network: networks.kmd,
    targets: _targets,
    utxo: [largestUTXO],
    changeAddress: address,
    outputAddress: address,
    change: Math.floor(Number(toSats(largestUTXO.amount - totalOutSize)) - 10000 + (toSats(largestUTXO.interest ? largestUTXO.interest : 0))), // 10k sat fee
  };
  
  console.log(payload);
  console.log(largestUTXO);

  const utxo = payload.utxo;
  const targets = payload.targets;
  const change = payload.change;
  const outputAddress = payload.outputAddress;
  const changeAddress = payload.changeAddress; 
  const network = payload.network;     
  console.log(network);
  
  let key = network && network.isZcash ? bitcoinZcash.ECPair.fromWIF(payload.wif, network) : bitcoinJS.ECPair.fromWIF(payload.wif, network);
  let tx;
  
  if (network.isZcash &&
      !network.sapling) {
    tx = new bitcoinZcash.TransactionBuilder(network);
  } else if (
    network.isZcash &&
    network.sapling &&
    ((network.saplingActivationTimestamp && Math.floor(Date.now() / 1000) > network.saplingActivationTimestamp) ||
    (network.saplingActivationHeight && utxo[0].currentHeight > network.saplingActivationHeight))
  ) {    
    tx = new bitcoinZcashSapling.TransactionBuilder(network);
  } else if (network.isPos) {
    tx = new bitcoinPos.TransactionBuilder(network);
  } else {
    tx = new bitcoinJS.TransactionBuilder(network);
  }

  console.log('buildSignedTx');
  console.log(`buildSignedTx pub key ${key.getAddress().toString()}`);

  for (let i = 0; i < utxo.length; i++) {
    tx.addInput(utxo[i].txid, utxo[i].vout);
  }

  for (let i = 0; i < targets.length; i++) {
    if (network &&
        network.isPos) {
      tx.addOutput(
        outputAddress,
        Number(targets[i]),
        network
      );
    } else {
      tx.addOutput(outputAddress, Number(targets[i]));
    }
  }
  
  if (Number(change) > 0) {
    if (network &&
        network.isPos) {
      tx.addOutput(
        changeAddress,
        Number(change),
        network
      );
    } else {
      console.log(`change ${change}`);
      tx.addOutput(changeAddress, Number(change));
    }
  }

  if (network.forkName &&
      network.forkName === 'btg') {
    tx.enableBitcoinGold(true);
    tx.setVersion(2);
  } else if (
    network.forkName &&
    network.forkName === 'bch'
  ) {
    tx.enableBitcoinCash(true);
    tx.setVersion(2);
  } else if (network.sapling) {
    let versionNum;

    if ((network.saplingActivationHeight && utxo[0].currentHeight >= network.saplingActivationHeight) ||
        (network.saplingActivationTimestamp && Math.floor(Date.now() / 1000) > network.saplingActivationTimestamp)) {
      versionNum = 4;
    } else {
      versionNum = 1;
    }
  
    if (versionNum) {
      tx.setVersion(versionNum);
    }
  }

  if (network.kmdInterest) {
    const _locktime = Math.floor(Date.now() / 1000) - 777;
    tx.setLockTime(_locktime);
  }
  
  for (let i = 0; i < utxo.length; i++) {
    if (network.isPoS) {
      tx.sign(network, i, key);
    } else if (network.isBtcFork) {
      const hashType = bitcoinJSForks.Transaction.SIGHASH_ALL | bitcoinJSForks.Transaction.SIGHASH_BITCOINCASHBIP143;
      tx.sign(i, btcFork.keyPair, null, hashType, utxo[i].satoshis);
    } else if (
      (network.sapling && network.saplingActivationTimestamp && Math.floor(Date.now() / 1000) > network.saplingActivationTimestamp) ||
      (network.sapling && network.saplingActivationHeight && utxo[0].currentHeight >= network.saplingActivationHeight)) {
      tx.sign(i, key, '', null, utxo[i].satoshis);
    } else {
      tx.sign(i, key);
    }
  }

  const rawtx = tx.build().toHex();

  console.log('\nrawtx =>>>\n');
  console.log(rawtx);
})();