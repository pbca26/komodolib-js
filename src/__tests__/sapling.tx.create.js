import test from 'tape';

const { transaction } = require('../transaction-builder');
const txDecoder = require('../transaction-decoder');
const networks = require('../bitcoinjs-networks');

const data = {
  "utxo": [{
    "txid":"33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout":2,
    "value":778970000,
    "verified":true,
    "height":241214,
    "currentHeight":261482,
  }],
  "change":678960000,
  "changeAdjusted":678960000,
  "totalInterest":0,
  "fee":10000,
  "value":100000000,
  "outputAddress":"RRyBxbrAPRUBCUpiJgJZYrkxqrh8x5ta9Z",
  "changeAddress":"RRyBxbrAPRUBCUpiJgJZYrkxqrh8x5ta9Z",
  "network":"vrsc",
  "wif": "Uu831oyJFDQ1BsQuucH1TG3CbD2YHmvXrwnFLeAi7f9PKxcmGri3"
};

const verusParams = networks.vrsc;
let verusParamsPreSapling = JSON.parse(JSON.stringify(verusParams));
verusParamsPreSapling.sapling = false;

const signedTxVRSC = transaction(
  data.outputAddress,
  data.changeAddress,
  data.wif,
  verusParamsPreSapling,
  data.utxo,
  data.change,
  data.value
);

const decodedTxVRSC = txDecoder(signedTxVRSC, verusParamsPreSapling);

const signedTxSaplingVRSC = transaction(
  data.outputAddress,
  data.changeAddress,
  data.wif,
  verusParams,
  data.utxo,
  data.change,
  data.value
);

const decodedTxSaplingVRSC = txDecoder(signedTxSaplingVRSC, verusParams);

const signedTxSaplingKmd = transaction(
  data.outputAddress,
  data.changeAddress,
  data.wif,
  networks.kmd,
  data.utxo,
  data.change,
  data.value
);

const decodedTxSaplingKmd = txDecoder(signedTxSaplingKmd, networks.kmd);

test('src - transaction-builder - vrsc regular tx', async (t) => {
  t.plan(1);
  t.equal(decodedTxVRSC.tx.version, 1);
});

test('src - transaction-builder - vrsc sapling tx', async (t) => {
  t.plan(1);
  t.equal(decodedTxSaplingVRSC.tx.version, 4);
});

test('src - transaction-builder - kmd regular tx', async (t) => {
  t.plan(1);
  t.equal(decodedTxSaplingKmd.tx.version, 1);
});