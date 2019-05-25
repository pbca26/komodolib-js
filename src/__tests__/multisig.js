import test from 'tape';

const keys = require('./src/keys');
const network = require('./src/bitcoinjs-networks.js');
const { transaction } = require('./src/transaction-builder');

// TODO: add proper asserts

const kp1 = keys.stringToWif('test1', network.kmd, true);
const kp2 = keys.stringToWif('test2', network.kmd, true);
const msigData = keys.msigAddress(
  2,
  [
    kp1.pubHex,
    kp2.pubHex,
  ],
  network.kmd
);

// create tx
const data = {
  utxo: [{
    txid: '2862fc1709c519aa707a1324cf8713f281db1352b638d34d43b5ab692c6d52da',
    vout: 0,
    value: 10000000,
    locktime: 1546789506,
    interest: 0,
    interestSats: 0,
    confirmations: 79,
    height: 1172572,
    currentHeight: 1172651,
  }],
  value: 10000000,
  change: 0,
  changeAdjusted: 0,
  totalInterest: 0,
  outputAddress: msigData.address,
  changeAddress: msigData.address,
  wif: kp1.priv,
  multisig: {
    creator: true,
    redeemScript: msigData.redeemScript,
    scriptPubKey: msigData.scriptPubKey,
  },
};

const signedTx = transaction(
  data.outputAddress,
  data.changeAddress,
  data.wif,
  network.kmd,
  data.utxo,
  data.change,
  data.value,
  {
    multisig: data.multisig,
  }
);

// console.log(signedTx);

const signedTxComplete = transaction(
  data.outputAddress,
  data.changeAddress,
  kp2.priv,
  network.kmd,
  data.utxo,
  data.change,
  data.value,
  {
    multisig: {
      rawtx: signedTx,
      redeemScript: msigData.redeemScript,
      scriptPubKey: msigData.scriptPubKey,
    },
  }
);

// console.log(signedTxComplete);

test('src - transaction-builder - kmd multisig tx', async (t) => {
  t.plan(1);
  t.equal(true, true);
});