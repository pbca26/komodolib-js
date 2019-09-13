// https://github.com/request/request/tree/master/tests

import test from 'tape';
import fs from 'fs';
import {
  stringToWif,
  etherKeys,
  multisig,
} from '../keys';
const { data } = require('../transaction-builder');
const {
  toSats,
  fromSats,
} = require('../utils');
import txDecoder from '../transaction-decoder';
import networks from '../bitcoinjs-networks';
const fixture = JSON.parse(fs.readFileSync(__dirname + '/fixtures/transaction.builder.json'));

test('src - data - BTC send to self', async (t) => {  
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];
  
  const d = data(
    networks.btc,
    toSats(0.001),
    toSats(0.0001),
    '1Hgzt5xsnbfc8UTWqWKSTLRm5bEYHYBoCE',
    '1Hgzt5xsnbfc8UTWqWKSTLRm5bEYHYBoCE',
    utxo
  );

  t.plan(1);
  t.deepEqual(d, fixture.data.BTC.self, 'should return calculated data');
});

test('src - data - BTC send to external address', async (t) => {  
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];
  
  const d = data(
    networks.btc,
    toSats(0.001),
    toSats(0.0001),
    '19eA3hUfKRt7aZymavdQFXg5EZ6KCVKxr8',
    '1Hgzt5xsnbfc8UTWqWKSTLRm5bEYHYBoCE',
    utxo
  );
  const d2 = data(
    networks.btc,
    toSats(0.001),
    {
      perByte: true,
      value: 10,
    },
    '19eA3hUfKRt7aZymavdQFXg5EZ6KCVKxr8',
    '1Hgzt5xsnbfc8UTWqWKSTLRm5bEYHYBoCE',
    utxo
  );

  t.plan(2);
  t.deepEqual(d, fixture.data.BTC.static_fee, 'should return calculated data (BTC static fee)');
  t.deepEqual(d2, fixture.data.BTC.dynamic_fee, 'should return calculated data (BTC dynamic fee)');
});

test('src - data - error handling', async (t) => {  
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];
  
  const d1 = () => data(
    networks.btc,
    toSats(0.001),
    toSats(0.0001),
    't1SWm42toHkfiBD2fXMSXPLmzVDHPuWS5Km',
    't1aZbtRP1kvTCj7WQmw8Zb9XgLFRd7rtthy',
    utxo
  );
  const d2 = () => data(
    networks.btc,
    toSats(0.001),
    toSats(0.0001),
    '19eA3hUfKRt7aZymavdQFXg5EZ6KCVKxr8',
    't1aZbtRP1kvTCj7WQmw8Zb9XgLFRd7rtthy',
    utxo
  );

  const utxo2 = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(0.00001),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];
  const d3 = () => data(
    networks.btc,
    toSats(0.001),
    toSats(0.0001),
    '19eA3hUfKRt7aZymavdQFXg5EZ6KCVKxr8',
    '19eA3hUfKRt7aZymavdQFXg5EZ6KCVKxr8',
    utxo2
  );
  const d4 = () => data(
    networks.btc,
    toSats(0.001),
    toSats(0.0001),
    '19eA3hUfKRt7aZymavdQFXg5EZ6KCVKxr8',
    '19eA3hUfKRt7aZymavdQFXg5EZ6KCVKxr8',
    []
  );
  const d5 = () => data(
    networks.btc,
    '123',
    toSats(0.0001),
    '19eA3hUfKRt7aZymavdQFXg5EZ6KCVKxr8',
    '19eA3hUfKRt7aZymavdQFXg5EZ6KCVKxr8',
    []
  );
  const d6 = () => data(
    networks.btc,
    -123,
    toSats(0.0001),
    '19eA3hUfKRt7aZymavdQFXg5EZ6KCVKxr8',
    '19eA3hUfKRt7aZymavdQFXg5EZ6KCVKxr8',
    []
  );
  const d7 = () => data(
    networks.btc,
    0.1,
    toSats(0.0001),
    '19eA3hUfKRt7aZymavdQFXg5EZ6KCVKxr8',
    '19eA3hUfKRt7aZymavdQFXg5EZ6KCVKxr8',
    []
  );

  const d8 = () => data(
    networks.btc,
    toSats(0.001),
    '123',
    '19eA3hUfKRt7aZymavdQFXg5EZ6KCVKxr8',
    '19eA3hUfKRt7aZymavdQFXg5EZ6KCVKxr8',
    []
  );
  const d9 = () => data(
    networks.btc,
    toSats(0.001),
    -123,
    '19eA3hUfKRt7aZymavdQFXg5EZ6KCVKxr8',
    '19eA3hUfKRt7aZymavdQFXg5EZ6KCVKxr8',
    []
  );
  const d10 = () => data(
    networks.btc,
    toSats(0.001),
    0.1,
    '19eA3hUfKRt7aZymavdQFXg5EZ6KCVKxr8',
    '19eA3hUfKRt7aZymavdQFXg5EZ6KCVKxr8',
    []
  );

  t.plan(10);
  t.throws(d1, /Invalid output address/, 'should throw "Invalid output address"');
  t.throws(d2, /Invalid change address/, 'should throw "Invalid change address"');
  t.throws(d3, /Spend value is too large/, 'should throw "Spend value is too large"');
  t.throws(d4, /No valid UTXO/, 'should throw "No valid UTXO"');
  t.throws(d5, /Wrong value/, 'should throw "Wrong value" (string)');
  t.throws(d6, /Wrong value/, 'should throw "Wrong value" (negative value)');
  t.throws(d7, /Wrong value/, 'should throw "Wrong value" (float)');
  t.throws(d8, /Wrong fee/, 'should throw "Wrong fee" (string)');
  t.throws(d9, /Wrong fee/, 'should throw "Wrong fee" (negative value)');
  t.throws(d10, /Wrong fee/, 'should throw "Wrong fee" (float)');
});

test('src - data - KMD send to self', async (t) => {  
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];
  
  const d = data(
    networks.kmd,
    toSats(0.001),
    toSats(0.0001),
    'RRyBxbrAPRUBCUpiJgJZYrkxqrh8x5ta9Z',
    'RRyBxbrAPRUBCUpiJgJZYrkxqrh8x5ta9Z',
    utxo
  );

  t.plan(1);
  t.deepEqual(d, fixture.data.KMD.self, 'should return calculated data');
});

test('src - data - KMD send to external address', async (t) => {  
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];
  
  const d = data(
    networks.kmd,
    toSats(0.001),
    toSats(0.0001),
    'RHvM8DMwvFggeaLy46cXM41GzpYur6oWEe',
    'RRyBxbrAPRUBCUpiJgJZYrkxqrh8x5ta9Z',
    utxo
  );

  t.plan(1);
  t.deepEqual(d, fixture.data.KMD.external, 'should return calculated data');
});

test('src - data - KMD send to self (rewards claim)', async (t) => {  
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
    "interest": toSats(0.1),
  }];
  
  const d = data(
    networks.kmd,
    toSats(0.001),
    toSats(0.0001),
    'RRyBxbrAPRUBCUpiJgJZYrkxqrh8x5ta9Z',
    'RRyBxbrAPRUBCUpiJgJZYrkxqrh8x5ta9Z',
    utxo
  );

  t.plan(1);
  t.deepEqual(d, fixture.data.KMD.interest_self, 'should return calculated data');
});

test('src - data - KMD send to external (rewards claim)', async (t) => {  
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
    "interest": toSats(0.1),
  }];
  
  const d = data(
    networks.kmd,
    toSats(0.001),
    toSats(0.0001),
    'RHvM8DMwvFggeaLy46cXM41GzpYur6oWEe',
    'RRyBxbrAPRUBCUpiJgJZYrkxqrh8x5ta9Z',
    utxo
  );

  t.plan(1);
  t.deepEqual(d, fixture.data.KMD.interest_external, 'should return calculated data');
});

test('src - data - KMD send to external (rewards claim)', async (t) => {  
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];
  
  const d = data(
    networks.kmd,
    toSats(0.9999),
    toSats(0.000091),
    'RRyBxbrAPRUBCUpiJgJZYrkxqrh8x5ta9Z',
    'RRyBxbrAPRUBCUpiJgJZYrkxqrh8x5ta9Z',
    utxo
  );

  t.plan(1);
  t.deepEqual(d, fixture.data.KMD.donate_dust_to_miners, 'should return calculated data');
});