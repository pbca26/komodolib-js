// https://github.com/request/request/tree/master/tests

// TODO: ZEC 1of2 sig2 test case

import test from 'tape';
import fs from 'fs';
const { toSats } = require('../utils');
const { checkSignatures } = require('../transaction-builder').multisig;
import networks from '../bitcoinjs-networks';
const fixture = JSON.parse(fs.readFileSync(__dirname + '/fixtures/transaction.builder.json'));

let networks_mod = JSON.parse(JSON.stringify(networks));
networks_mod.zec.multisigSkipKPVerify = true;

test('src - checkSignatures error handling', async (t) => {
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];

  const signatures = () => checkSignatures(
    utxo,
    fixture.transaction.multisig.BTC_1of2_sig1,
    fixture.multisigWallet.BTC_3of3.redeemScript,
    networks.btc
  );

  t.plan(1);
  t.throws(signatures, /Wrong reedeem script value/, 'should throw "Wrong reedeem script value"');
});

test('src - checkSignatures - BTC multisig 1 of 2 (signature 1)', async (t) => {
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];
  const signatures = checkSignatures(
    utxo,
    fixture.transaction.multisig.BTC_1of2_sig1,
    fixture.multisigWallet.BTC_1of2.redeemScript,
    networks.btc
  );

  t.plan(1);
  t.deepEqual(signatures, fixture.checkSignatures.BTC_1of2_sig1, 'should return parsed signatures data');
});

test('src - checkSignatures - BTC multisig 1 of 2 (signature 2)', async (t) => {
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];
  const signatures = checkSignatures(
    utxo,
    fixture.transaction.multisig.BTC_1of2_sig2,
    fixture.multisigWallet.BTC_1of2.redeemScript,
    networks.btc
  );

  t.plan(1);
  t.deepEqual(signatures, fixture.checkSignatures.BTC_1of2_sig2, 'should return parsed signatures data');
});

test('src - checkSignatures - BTC multisig 2 of 2', async (t) => {
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];
  const signatures = checkSignatures(
    utxo,
    fixture.transaction.multisig.BTC_2of2_complete,
    fixture.multisigWallet.BTC_2of2.redeemScript,
    networks.btc
  );

  t.plan(1);
  t.deepEqual(signatures, fixture.checkSignatures.BTC_2of2_complete, 'should return parsed signatures data');
});

test('src - checkSignatures - BTC multisig 2 of 3', async (t) => {
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];
  const signatures = checkSignatures(
    utxo,
    fixture.transaction.multisig.BTC_2of3_complete,
    fixture.multisigWallet.BTC_2of3.redeemScript,
    networks.btc
  );

  t.plan(1);
  t.deepEqual(signatures, fixture.checkSignatures.BTC_2of3_complete, 'should return parsed signatures data');
});

test('src - checkSignatures - BTC multisig 3 of 3', async (t) => {
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];
  const signatures = checkSignatures(
    utxo,
    fixture.transaction.multisig.BTC_3of3_complete,
    fixture.multisigWallet.BTC_3of3.redeemScript,
    networks.btc
  );

  t.plan(1);
  t.deepEqual(signatures, fixture.checkSignatures.BTC_3of3_complete, 'should return parsed signatures data');
});

test('src - checkSignatures - ZEC multisig 1 of 2 (signature 1)', async (t) => {
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 419201,
    "currentHeight": 419201,
  }];
  const signatures = checkSignatures(
    utxo,
    fixture.transaction.multisig.ZEC_1of2_sig1,
    fixture.multisigWallet.ZEC_1of2.redeemScript,
    networks_mod.zec
  );

  t.plan(1);
  t.deepEqual(signatures, fixture.checkSignatures.ZEC_1of2_sig1, 'should return parsed signatures data');
});

test('src - checkSignatures - ZEC multisig 2 of 2', async (t) => {
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 419201,
    "currentHeight": 419201,
  }];
  const signatures = checkSignatures(
    utxo,
    fixture.transaction.multisig.ZEC_2of2_complete,
    fixture.multisigWallet.ZEC_2of2.redeemScript,
    networks_mod.zec
  );

  t.plan(1);
  t.deepEqual(signatures, fixture.checkSignatures.ZEC_2of2_complete, 'should return parsed signatures data');
});

test('src - checkSignatures - ZEC multisig 2 of 3', async (t) => {
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 419201,
    "currentHeight": 419201,
  }];
  const signatures = checkSignatures(
    utxo,
    fixture.transaction.multisig.ZEC_2of3_complete,
    fixture.multisigWallet.ZEC_2of3.redeemScript,
    networks_mod.zec
  );

  t.plan(1);
  t.deepEqual(signatures, fixture.checkSignatures.ZEC_2of3_complete, 'should return parsed signatures data');
});

test('src - checkSignatures - ZEC multisig 3 of 3', async (t) => {
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 419201,
    "currentHeight": 419201,
  }];
  const signatures = checkSignatures(
    utxo,
    fixture.transaction.multisig.ZEC_3of3_complete,
    fixture.multisigWallet.ZEC_3of3.redeemScript,
    networks_mod.zec
  );

  t.plan(1);
  t.deepEqual(signatures, fixture.checkSignatures.ZEC_3of3_complete, 'should return parsed signatures data');
});