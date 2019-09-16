// https://github.com/request/request/tree/master/tests

import test from 'tape';
import fs from 'fs';
import {
  stringToWif,
  etherKeys,
  multisig,
} from '../keys';
const {
  data,
  transaction,
} = require('../transaction-builder');
const {
  toSats,
  fromSats,
} = require('../utils');
import txDecoder from '../transaction-decoder';
import networks from '../bitcoinjs-networks';
const fixture = JSON.parse(fs.readFileSync(__dirname + '/fixtures/transaction.builder.json'));

test('src - transaction - error handling', async (t) => {  
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];
  
  const tx1 = () => transaction(
    't1SWm42toHkfiBD2fXMSXPLmzVDHPuWS5Km',
    't1aZbtRP1kvTCj7WQmw8Zb9XgLFRd7rtthy',
    'L2LCi8MKjzRkipcpj4bRgpMyf8yQCfev6SQRmPP2ewvgS6fGEbMb',
    networks.btc,
    utxo,
    toSats(0.001),
    toSats(0.0001)
  );
  const tx2 = () => transaction(
    '19eA3hUfKRt7aZymavdQFXg5EZ6KCVKxr8',
    't1aZbtRP1kvTCj7WQmw8Zb9XgLFRd7rtthy',
    'L2LCi8MKjzRkipcpj4bRgpMyf8yQCfev6SQRmPP2ewvgS6fGEbMb',
    networks.btc,
    utxo,
    toSats(0.001),
    toSats(0.0001)
  );

  const utxo2 = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(0.00001),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];
  const tx3 = () => transaction(
    '19eA3hUfKRt7aZymavdQFXg5EZ6KCVKxr8',
    '19eA3hUfKRt7aZymavdQFXg5EZ6KCVKxr8',
    'L2LCi8MKjzRkipcpj4bRgpMyf8yQCfev6SQRmPP2ewvgS6fGEbMb',
    networks.btc,
    [],
    toSats(0.001),
    toSats(0.0001),
  );
  const tx4 = () => transaction(
    '19eA3hUfKRt7aZymavdQFXg5EZ6KCVKxr8',
    '19eA3hUfKRt7aZymavdQFXg5EZ6KCVKxr8',
    'L2LCi8MKjzRkipcpj4bRgpMyf8yQCfev6SQRmPP2ewvgS6fGEbMb',
    networks.btc,
    [],
    '123',
    toSats(0.0001),
  );
  const tx5 = () => transaction(
    '19eA3hUfKRt7aZymavdQFXg5EZ6KCVKxr8',
    '19eA3hUfKRt7aZymavdQFXg5EZ6KCVKxr8',
    'L2LCi8MKjzRkipcpj4bRgpMyf8yQCfev6SQRmPP2ewvgS6fGEbMb',
    networks.btc,
    [],
    -123,
    toSats(0.0001),
  );
  const tx6 = () => transaction(
    '19eA3hUfKRt7aZymavdQFXg5EZ6KCVKxr8',
    '19eA3hUfKRt7aZymavdQFXg5EZ6KCVKxr8',
    'L2LCi8MKjzRkipcpj4bRgpMyf8yQCfev6SQRmPP2ewvgS6fGEbMb',
    networks.btc,
    [],
    0.1,
    toSats(0.0001),
  );

  const tx7 = () => transaction(
    '19eA3hUfKRt7aZymavdQFXg5EZ6KCVKxr8',
    '19eA3hUfKRt7aZymavdQFXg5EZ6KCVKxr8',
    'L2LCi8MKjzRkipcpj4bRgpMyf8yQCfev6SQRmPP2ewvgS6fGEbMb',
    networks.btc,
    [],
    toSats(0.001),
    '123',
  );
  const tx8 = () => transaction(
    '19eA3hUfKRt7aZymavdQFXg5EZ6KCVKxr8',
    '19eA3hUfKRt7aZymavdQFXg5EZ6KCVKxr8',
    'L2LCi8MKjzRkipcpj4bRgpMyf8yQCfev6SQRmPP2ewvgS6fGEbMb',
    networks.btc,
    [],
    toSats(0.001),
    -123,
  );
  const tx9 = () => transaction(
    '19eA3hUfKRt7aZymavdQFXg5EZ6KCVKxr8',
    '19eA3hUfKRt7aZymavdQFXg5EZ6KCVKxr8',
    'L2LCi8MKjzRkipcpj4bRgpMyf8yQCfev6SQRmPP2ewvgS6fGEbMb',
    networks.btc,
    [],
    toSats(0.001),
    0.1,
  );
  const tx10 = () => transaction(
    '19eA3hUfKRt7aZymavdQFXg5EZ6KCVKxr8',
    '19eA3hUfKRt7aZymavdQFXg5EZ6KCVKxr8',
    null,
    networks.btc,
    [],
    toSats(0.001),
    0.1,
  );
  const tx11 = () => transaction(
    '19eA3hUfKRt7aZymavdQFXg5EZ6KCVKxr8',
    '19eA3hUfKRt7aZymavdQFXg5EZ6KCVKxr8',
    'L2LCi8MKjzRkipcpj4bRgpMyf8yQCfev6SQRmPP2ewvgS6fGEbMb',
    networks.btc,
    [],
    toSats(0.001),
    toSats(0.1),
    {
      multisig: {

      }
    }
  );

  t.plan(11);
  t.throws(tx1, /Invalid output address/, 'should throw "Invalid output address"');
  t.throws(tx2, /Invalid change address/, 'should throw "Invalid change address"');
  t.throws(tx3, /Transaction has no inputs/, 'should throw "Transaction has no inputs"');
  t.throws(tx4, /Wrong change value/, 'should throw "Wrong change value" (string)');
  t.throws(tx5, /Wrong change value/, 'should throw "Wrong change value" (negative value)');
  t.throws(tx6, /Wrong change value/, 'should throw "Wrong change value" (float)');
  t.throws(tx7, /Wrong spend value/, 'should throw "Wrong spend value" (string)');
  t.throws(tx8, /Wrong spend value/, 'should throw "Wrong spend value" (negative value)');
  t.throws(tx9, /Wrong spend value/, 'should throw "Wrong spend value" (float)');
  t.throws(tx10, /Invalid WIF format/, 'should throw "Invalid WIF format"');
  t.throws(tx11, /Missing reedeem script string/, 'should throw "Missing reedeem script string" (multisig)');
});

test('src - transaction - BTC send to self', async (t) => {  
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];
  
  const tx = transaction(
    '1Hgzt5xsnbfc8UTWqWKSTLRm5bEYHYBoCE',
    '1Hgzt5xsnbfc8UTWqWKSTLRm5bEYHYBoCE',
    'L2LCi8MKjzRkipcpj4bRgpMyf8yQCfev6SQRmPP2ewvgS6fGEbMb',
    networks.btc,
    utxo,
    toSats(0.001),
    toSats(0.0001),
  );

  t.plan(1);
  t.equal(tx, fixture.transaction.single.BTC.self, 'should return raw hex');
});

test('src - transaction - BTC send to external address', async (t) => {  
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];
  
  const tx = transaction(
    '1Hgzt5xsnbfc8UTWqWKSTLRm5bEYHYBoCE',
    '19eA3hUfKRt7aZymavdQFXg5EZ6KCVKxr8',
    'L2LCi8MKjzRkipcpj4bRgpMyf8yQCfev6SQRmPP2ewvgS6fGEbMb',
    networks.btc,
    utxo,
    toSats(0.001),
    toSats(0.0001),
  );

  t.plan(1);
  t.equal(tx, fixture.transaction.single.BTC.external, 'should return raw hex');
});

test('src - transaction - BTC opreturn', async (t) => {  
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];
  
  const tx = transaction(
    '1Hgzt5xsnbfc8UTWqWKSTLRm5bEYHYBoCE',
    '1Hgzt5xsnbfc8UTWqWKSTLRm5bEYHYBoCE',
    'L2LCi8MKjzRkipcpj4bRgpMyf8yQCfev6SQRmPP2ewvgS6fGEbMb',
    networks.btc,
    utxo,
    toSats(0.001),
    toSats(0.0001),
    { opreturn: 'test' }
  );

  t.plan(1);
  t.equal(tx, fixture.transaction.single.BTC.opreturn, 'should return raw hex');
});

test('src - transaction - BTC unsigned', async (t) => {  
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];
  
  const tx = transaction(
    '1Hgzt5xsnbfc8UTWqWKSTLRm5bEYHYBoCE',
    '1Hgzt5xsnbfc8UTWqWKSTLRm5bEYHYBoCE',
    'L2LCi8MKjzRkipcpj4bRgpMyf8yQCfev6SQRmPP2ewvgS6fGEbMb',
    networks.btc,
    utxo,
    toSats(0.001),
    toSats(0.0001),
    { unsigned: true }
  );

  t.plan(1);
  t.equal(tx, fixture.transaction.single.BTC.unsigned, 'should return raw hex');
});

test('src - transaction - BTG send to self', async (t) => {  
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];
  
  const tx = transaction(
    'GaXvJDHpmTGuCwkomSyYt6mezm2PMuZtj6',
    'GaXvJDHpmTGuCwkomSyYt6mezm2PMuZtj6',
    'L2LCi8MKjzRkipcpj4bRgpMyf8yQCfev6SQRmPP2ewvgS6fGEbMb',
    networks.btg,
    utxo,
    toSats(0.9),
    toSats(0.1),
  );

  t.plan(1);
  t.equal(tx, fixture.transaction.single.BTG.self, 'should return raw hex');
});

test('src - transaction - BTG send to external address', async (t) => {  
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];
  
  const tx = transaction(
    'GSV5TpocJHVQf3H4WsHWgJ1y9itABm5XEA',
    'GaXvJDHpmTGuCwkomSyYt6mezm2PMuZtj6',
    'L2LCi8MKjzRkipcpj4bRgpMyf8yQCfev6SQRmPP2ewvgS6fGEbMb',
    networks.btg,
    utxo,
    toSats(0.9),
    toSats(0.1),
  );

  t.plan(1);
  t.equal(tx, fixture.transaction.single.BTG.external, 'should return raw hex');
});

test('src - transaction - BCH send to self', async (t) => {  
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];
  
  const tx = transaction(
    '1Hgzt5xsnbfc8UTWqWKSTLRm5bEYHYBoCE',
    '1Hgzt5xsnbfc8UTWqWKSTLRm5bEYHYBoCE',
    'L2LCi8MKjzRkipcpj4bRgpMyf8yQCfev6SQRmPP2ewvgS6fGEbMb',
    networks.bch,
    utxo,
    toSats(0.9),
    toSats(0.1),
  );

  t.plan(1);
  t.equal(tx, fixture.transaction.single.BCH.self, 'should return raw hex');
});

test('src - transaction - BCH send to external address', async (t) => {  
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];
  
  const tx = transaction(
    '19eA3hUfKRt7aZymavdQFXg5EZ6KCVKxr8',
    '1Hgzt5xsnbfc8UTWqWKSTLRm5bEYHYBoCE',
    'L2LCi8MKjzRkipcpj4bRgpMyf8yQCfev6SQRmPP2ewvgS6fGEbMb',
    networks.bch,
    utxo,
    toSats(0.9),
    toSats(0.1),
  );

  t.plan(1);
  t.equal(tx, fixture.transaction.single.BCH.external, 'should return raw hex');
});

test('src - transaction - BLK send to self', async (t) => {  
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];
  
  const tx = transaction(
    'BM95VoR5Y7FWaJwgSzeQaUERpCg83cHTb9',
    'BM95VoR5Y7FWaJwgSzeQaUERpCg83cHTb9',
    'Pipy1AMp7qLC5kx2YxTkbAj9szzi58S6AUygkk3PvumUUNbredQ9',
    networks.blk,
    utxo,
    toSats(0.9),
    toSats(0.1),
  );

  t.plan(1);
  t.deepEqual({
    outputs: txDecoder(tx, networks.blk).outputs,
    inputs: txDecoder(tx, networks.blk).inputs,
    version: txDecoder(tx, networks.blk).format.version,
  }, {
    outputs: txDecoder(fixture.transaction.single.BLK.self, networks.blk).outputs,
    inputs: txDecoder(fixture.transaction.single.BLK.self, networks.blk).inputs,
    version: txDecoder(fixture.transaction.single.BLK.self, networks.blk).format.version,    
  }, 'should return raw hex');
});

test('src - transaction - BLK send to external address', async (t) => {  
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];
  
  const tx = transaction(
    'BD6EfQvs4wU22QTwCQxNNfUjyAXtvSxSNs',
    'BM95VoR5Y7FWaJwgSzeQaUERpCg83cHTb9',
    'Pipy1AMp7qLC5kx2YxTkbAj9szzi58S6AUygkk3PvumUUNbredQ9',
    networks.blk,
    utxo,
    toSats(0.9),
    toSats(0.1),
  );

  t.plan(1);
  t.deepEqual({
    outputs: txDecoder(tx, networks.blk).outputs,
    inputs: txDecoder(tx, networks.blk).inputs,
    version: txDecoder(tx, networks.blk).format.version,
  }, {
    outputs: txDecoder(fixture.transaction.single.BLK.external, networks.blk).outputs,
    inputs: txDecoder(fixture.transaction.single.BLK.external, networks.blk).inputs,
    version: txDecoder(fixture.transaction.single.BLK.external, networks.blk).format.version,    
  }, 'should return raw hex');
});

test('src - transaction - ZEC send to self', async (t) => {  
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 419201,
    "currentHeight": 419201,
  }];
  
  const tx = transaction(
    't1aZbtRP1kvTCj7WQmw8Zb9XgLFRd7rtthy',
    't1aZbtRP1kvTCj7WQmw8Zb9XgLFRd7rtthy',
    'L2LCi8MKjzRkipcpj4bRgpMyf8yQCfev6SQRmPP2ewvgS6fGEbMb',
    networks.zec,
    utxo,
    toSats(0.9),
    toSats(0.1),
  );

  t.plan(1);
  t.equal(tx, fixture.transaction.single.ZEC.self, 'should return raw hex');
});

test('src - data - ZEC send to external address', async (t) => {  
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 419201,
    "currentHeight": 419201,
  }];
  
  const tx = transaction(
    't1SWm42toHkfiBD2fXMSXPLmzVDHPuWS5Km',
    't1aZbtRP1kvTCj7WQmw8Zb9XgLFRd7rtthy',
    'L2LCi8MKjzRkipcpj4bRgpMyf8yQCfev6SQRmPP2ewvgS6fGEbMb',
    networks.zec,
    utxo,
    toSats(0.9),
    toSats(0.1),
  );

  t.plan(1);
  t.equal(tx, fixture.transaction.single.ZEC.external, 'should return raw hex');
});

test('src - transaction - OOT send to self (pre-sapling)', async (t) => {  
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];
  
  const tx = transaction(
    'RRyBxbrAPRUBCUpiJgJZYrkxqrh8x5ta9Z',
    'RRyBxbrAPRUBCUpiJgJZYrkxqrh8x5ta9Z',
    'Uu831oyJFDQ1BsQuucH1TG3CbD2YHmvXrwnFLeAi7f9PKxcmGri3',
    networks.oot,
    utxo,
    toSats(0.9),
    toSats(0.1),
  );

  t.plan(1);
  t.equal(tx, fixture.transaction.single.OOT.self, 'should return raw hex');
});

test('src - transaction - OOT send to external address (pre-sapling)', async (t) => {  
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];
  
  const tx = transaction(
    'RHvM8DMwvFggeaLy46cXM41GzpYur6oWEe',
    'RRyBxbrAPRUBCUpiJgJZYrkxqrh8x5ta9Z',
    'Uu831oyJFDQ1BsQuucH1TG3CbD2YHmvXrwnFLeAi7f9PKxcmGri3',
    networks.oot,
    utxo,
    toSats(0.9),
    toSats(0.1),
  );

  t.plan(1);
  t.equal(tx, fixture.transaction.single.OOT.external, 'should return raw hex');
});

test('src - transaction - GRS send to self', async (t) => {  
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];
  
  const tx = transaction(
    'FmriKzhFM6M9a5UdicJuurE5jkWVtNdSB9',
    'FmriKzhFM6M9a5UdicJuurE5jkWVtNdSB9',
    'L2LCi8MKjzRkipcpj4bRgpMyf8yQCfev6SQRmPP2ewvgS6fGEbMb',
    networks.grs,
    utxo,
    toSats(0.9),
    toSats(0.1),
  );

  t.plan(1);
  t.equal(tx, fixture.transaction.single.GRS.self, 'should return raw hex');
});

test('src - transaction - GRS send to external address', async (t) => {  
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];
  
  const tx = transaction(
    'FdosVcD2svZf2AztU2csi3UPtiNGju8WJB',
    'FmriKzhFM6M9a5UdicJuurE5jkWVtNdSB9',
    'L2LCi8MKjzRkipcpj4bRgpMyf8yQCfev6SQRmPP2ewvgS6fGEbMb',
    networks.grs,
    utxo,
    toSats(0.9),
    toSats(0.1),
  );

  t.plan(1);
  t.equal(tx, fixture.transaction.single.GRS.external, 'should return raw hex');
});

test('src - transaction - KMD send to self', async (t) => {  
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];
  
  const tx = transaction(
    'RRyBxbrAPRUBCUpiJgJZYrkxqrh8x5ta9Z',
    'RRyBxbrAPRUBCUpiJgJZYrkxqrh8x5ta9Z',
    'Uu831oyJFDQ1BsQuucH1TG3CbD2YHmvXrwnFLeAi7f9PKxcmGri3',
    networks.kmd,
    utxo,
    toSats(0.9),
    toSats(0.1),
  );

  t.plan(1);
  t.deepEqual({
    outputs: txDecoder(tx, networks.kmd).outputs,
    overwintered: txDecoder(tx, networks.kmd).overwintered,
    versionGroupId: txDecoder(tx, networks.kmd).versionGroupId,
    version: txDecoder(tx, networks.kmd).format.version,
  }, {
    outputs: txDecoder(fixture.transaction.single.KMD.self, networks.kmd).outputs,
    overwintered: txDecoder(fixture.transaction.single.KMD.self, networks.kmd).overwintered,
    versionGroupId: txDecoder(fixture.transaction.single.KMD.self, networks.kmd).versionGroupId,
    version: txDecoder(fixture.transaction.single.KMD.self, networks.kmd).format.version,    
  }, 'should return raw hex');
});

test('src - transaction - KMD send to external address', async (t) => {  
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];
  
  const tx = transaction(
    'RHvM8DMwvFggeaLy46cXM41GzpYur6oWEe',
    'RRyBxbrAPRUBCUpiJgJZYrkxqrh8x5ta9Z',
    'Uu831oyJFDQ1BsQuucH1TG3CbD2YHmvXrwnFLeAi7f9PKxcmGri3',
    networks.kmd,
    utxo,
    toSats(0.9),
    toSats(0.1),
  );

  t.plan(1);
  t.deepEqual({
    outputs: txDecoder(tx, networks.kmd).outputs,
    overwintered: txDecoder(tx, networks.kmd).overwintered,
    versionGroupId: txDecoder(tx, networks.kmd).versionGroupId,
    version: txDecoder(tx, networks.kmd).format.version,
  }, {
    outputs: txDecoder(fixture.transaction.single.KMD.external, networks.kmd).outputs,
    overwintered: txDecoder(fixture.transaction.single.KMD.external, networks.kmd).overwintered,
    versionGroupId: txDecoder(fixture.transaction.single.KMD.external, networks.kmd).versionGroupId,
    version: txDecoder(fixture.transaction.single.KMD.external, networks.kmd).format.version,    
  }, 'should return raw hex');
});

test('src - transaction - KMD interest claim (self)', async (t) => {  
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];
  
  const tx = transaction(
    'RRyBxbrAPRUBCUpiJgJZYrkxqrh8x5ta9Z',
    'RRyBxbrAPRUBCUpiJgJZYrkxqrh8x5ta9Z',
    'Uu831oyJFDQ1BsQuucH1TG3CbD2YHmvXrwnFLeAi7f9PKxcmGri3',
    networks.kmd,
    utxo,
    toSats(0.9),
    toSats(0.2),
  );

  t.plan(1);
  t.deepEqual({
    outputs: txDecoder(tx, networks.kmd).outputs,
    overwintered: txDecoder(tx, networks.kmd).overwintered,
    versionGroupId: txDecoder(tx, networks.kmd).versionGroupId,
    version: txDecoder(tx, networks.kmd).format.version,
  }, {
    outputs: txDecoder(fixture.transaction.single.KMD.interest_self, networks.kmd).outputs,
    overwintered: txDecoder(fixture.transaction.single.KMD.interest_self, networks.kmd).overwintered,
    versionGroupId: txDecoder(fixture.transaction.single.KMD.interest_self, networks.kmd).versionGroupId,
    version: txDecoder(fixture.transaction.single.KMD.interest_self, networks.kmd).format.version,    
  }, 'should return raw hex');
});

test('src - transaction - KMD interest claim (external)', async (t) => {  
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];
  
  const tx = transaction(
    'RHvM8DMwvFggeaLy46cXM41GzpYur6oWEe',
    'RRyBxbrAPRUBCUpiJgJZYrkxqrh8x5ta9Z',
    'Uu831oyJFDQ1BsQuucH1TG3CbD2YHmvXrwnFLeAi7f9PKxcmGri3',
    networks.kmd,
    utxo,
    toSats(0.9),
    toSats(0.2),
  );

  t.plan(1);
  t.deepEqual({
    outputs: txDecoder(tx, networks.kmd).outputs,
    overwintered: txDecoder(tx, networks.kmd).overwintered,
    versionGroupId: txDecoder(tx, networks.kmd).versionGroupId,
    version: txDecoder(tx, networks.kmd).format.version,
  }, {
    outputs: txDecoder(fixture.transaction.single.KMD.interest_external, networks.kmd).outputs,
    overwintered: txDecoder(fixture.transaction.single.KMD.interest_external, networks.kmd).overwintered,
    versionGroupId: txDecoder(fixture.transaction.single.KMD.interest_external, networks.kmd).versionGroupId,
    version: txDecoder(fixture.transaction.single.KMD.interest_external, networks.kmd).format.version,    
  }, 'should return raw hex');
});