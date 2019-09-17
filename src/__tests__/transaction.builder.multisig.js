// https://github.com/request/request/tree/master/tests

import test from 'tape';
import fs from 'fs';
import {
  stringToWif,
  etherKeys,
  multisig,
} from '../keys';
const { transaction } = require('../transaction-builder');
//const { sign } = require('../transaction-builder').multisig;
const {
  toSats,
  fromSats,
} = require('../utils');
import txDecoder from '../transaction-decoder';
import networks from '../bitcoinjs-networks';
const fixture = JSON.parse(fs.readFileSync(__dirname + '/fixtures/transaction.builder.json'));

const pubKeys = [
  stringToWif('test').pubHex,
  stringToWif('test1').pubHex,
  stringToWif('test2').pubHex,
];
const wifKeysBTC = [
  stringToWif('test').priv,
  stringToWif('test1').priv,
  stringToWif('test2').priv,
];
const wifKeysZEC = [
  stringToWif('test', networks.zec).priv,
  stringToWif('test1', networks.zec).priv,
  stringToWif('test2', networks.zec).priv,
];

test('src - transaction - multisig error handling', async (t) => {
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];
  
  const tx = () => transaction(
    '3DiDuRh8k4LfGW8MKVxaLd5gYBTuuokz5M',
    '3DiDuRh8k4LfGW8MKVxaLd5gYBTuuokz5M',
    wifKeysBTC[0],
    networks.btc,
    utxo,
    toSats(0.9),
    toSats(0.1),
    {
      multisig: {
        creator: true,
        redeemScript: '5121037fbd5d1fdc830f0aead6f86534631e666ebb49ccd4d0c05446ea05cda978536321025eb94873782906e8a058cd3e873b2471612e3a5ae2597a23f8113214e11b1b1452ae'
      }
    }
  );

  t.plan(1);
  t.throws(tx, /Wrong multisig signing key or redeem sript/, 'should throw "Wrong multisig signing key or redeem sript"');
});

test('src - transaction - BTC multisig 1 of 2 (signature 1)', async (t) => {
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];
  
  const tx = transaction(
    fixture.multisigWallet.BTC_1of2.address,
    fixture.multisigWallet.BTC_1of2.address,
    wifKeysBTC[0],
    networks.btc,
    utxo,
    toSats(0.9),
    toSats(0.1),
    {
      multisig: {
        creator: true,
        redeemScript: fixture.multisigWallet.BTC_1of2.redeemScript,
      }
    }
  );

  t.plan(1);
  t.equal(tx, fixture.transaction.multisig.BTC_1of2_sig1, 'should return raw hex');
});

test('src - transaction - BTC multisig 1 of 2 (signature 2)', async (t) => {
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];
  
  const tx = transaction(
    fixture.multisigWallet.BTC_1of2.address,
    fixture.multisigWallet.BTC_1of2.address,
    wifKeysBTC[1],
    networks.btc,
    utxo,
    toSats(0.9),
    toSats(0.1),
    {
      multisig: {
        creator: true,
        redeemScript: fixture.multisigWallet.BTC_1of2.redeemScript,
      }
    }
  );

  t.plan(1);
  t.equal(tx, fixture.transaction.multisig.BTC_1of2_sig2, 'should return raw hex');
});

test('src - transaction - BTC multisig 1 of 2 (unsigned)', async (t) => {
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];
  
  const tx = transaction(
    fixture.multisigWallet.BTC_1of2.address,
    fixture.multisigWallet.BTC_1of2.address,
    wifKeysBTC[0],
    networks.btc,
    utxo,
    toSats(0.9),
    toSats(0.1),
    {
      unsigned: true,
      multisig: {
        creator: true,
        redeemScript: fixture.multisigWallet.BTC_1of2.redeemScript,
      }
    }
  );

  t.plan(1);
  t.equal(tx, fixture.transaction.multisig.BTC_1of2_unsigned, 'should return raw hex');
});

test('src - transaction - BTC multisig 2 of 2', async (t) => {
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];

  const tx = transaction(
    fixture.multisigWallet.BTC_2of2.address,
    fixture.multisigWallet.BTC_2of2.address,
    wifKeysBTC[0],
    networks.btc,
    utxo,
    toSats(0.9),
    toSats(0.1),
    {
      multisig: {
        incomplete: true,
        creator: true,
        redeemScript: fixture.multisigWallet.BTC_2of2.redeemScript,
      }
    }
  );
  
  const tx2 = transaction(
    fixture.multisigWallet.BTC_2of2.address,
    fixture.multisigWallet.BTC_2of2.address,
    wifKeysBTC[1],
    networks.btc,
    utxo,
    toSats(0.9),
    toSats(0.1),
    {
      multisig: {
        rawtx: tx,
        redeemScript: fixture.multisigWallet.BTC_2of2.redeemScript,
      }
    }
  );

  /*const tx2 = sign(
    wifKeysBTC[1],
    networks.btc,
    utxo,
    {
      multisig: {
        rawtx: tx,
        redeemScript: fixture.multisigWallet.BTC_2of2.redeemScript,
      }
    }
  );*/
  
  t.plan(1);
  t.equal(tx2, fixture.transaction.multisig.BTC_2of2_complete, 'should return raw hex');
});

test('src - transaction - BTC multisig 2 of 3', async (t) => {
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];

  const tx = transaction(
    fixture.multisigWallet.BTC_2of3.address,
    fixture.multisigWallet.BTC_2of3.address,
    wifKeysBTC[0],
    networks.btc,
    utxo,
    toSats(0.9),
    toSats(0.1),
    {
      multisig: {
        incomplete: true,
        creator: true,
        redeemScript: fixture.multisigWallet.BTC_2of3.redeemScript,
      }
    }
  );
  
  const tx2 = transaction(
    fixture.multisigWallet.BTC_2of3.address,
    fixture.multisigWallet.BTC_2of3.address,
    wifKeysBTC[1],
    networks.btc,
    utxo,
    toSats(0.9),
    toSats(0.1),
    {
      multisig: {
        rawtx: tx,
        redeemScript: fixture.multisigWallet.BTC_2of3.redeemScript,
      }
    }
  );

  t.plan(1);
  t.equal(tx2, fixture.transaction.multisig.BTC_2of3_complete, 'should return raw hex');
});

test('src - transaction - BTC multisig 3 of 3', async (t) => {
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];

  const tx = transaction(
    fixture.multisigWallet.BTC_3of3.address,
    fixture.multisigWallet.BTC_3of3.address,
    wifKeysBTC[0],
    networks.btc,
    utxo,
    toSats(0.9),
    toSats(0.1),
    {
      multisig: {
        incomplete: true,
        creator: true,
        redeemScript: fixture.multisigWallet.BTC_3of3.redeemScript,
      }
    }
  );
  
  const tx2 = transaction(
    fixture.multisigWallet.BTC_3of3.address,
    fixture.multisigWallet.BTC_3of3.address,
    wifKeysBTC[1],
    networks.btc,
    utxo,
    toSats(0.9),
    toSats(0.1),
    {
      multisig: {
        incomplete: true,
        rawtx: tx,
        redeemScript: fixture.multisigWallet.BTC_3of3.redeemScript,
      }
    }
  );
  
  const tx3 = transaction(
    fixture.multisigWallet.BTC_3of3.address,
    fixture.multisigWallet.BTC_3of3.address,
    wifKeysBTC[2],
    networks.btc,
    utxo,
    toSats(0.9),
    toSats(0.1),
    {
      multisig: {
        rawtx: tx2,
        redeemScript: fixture.multisigWallet.BTC_3of3.redeemScript,
      }
    }
  );

  t.plan(1);
  t.equal(tx3, fixture.transaction.multisig.BTC_3of3_complete, 'should return raw hex');
});

test('src - transaction - BTC multisig 3 of 3 (out of order signatures)', async (t) => {
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 1,
    "currentHeight": 1,
  }];

  const tx = transaction(
    fixture.multisigWallet.BTC_3of3.address,
    fixture.multisigWallet.BTC_3of3.address,
    wifKeysBTC[2],
    networks.btc,
    utxo,
    toSats(0.9),
    toSats(0.1),
    {
      multisig: {
        incomplete: true,
        creator: true,
        redeemScript: fixture.multisigWallet.BTC_3of3.redeemScript,
      }
    }
  );
  
  const tx2 = transaction(
    fixture.multisigWallet.BTC_3of3.address,
    fixture.multisigWallet.BTC_3of3.address,
    wifKeysBTC[0],
    networks.btc,
    utxo,
    toSats(0.9),
    toSats(0.1),
    {
      multisig: {
        incomplete: true,
        rawtx: tx,
        redeemScript: fixture.multisigWallet.BTC_3of3.redeemScript,
      }
    }
  );
  
  const tx3 = transaction(
    fixture.multisigWallet.BTC_3of3.address,
    fixture.multisigWallet.BTC_3of3.address,
    wifKeysBTC[1],
    networks.btc,
    utxo,
    toSats(0.9),
    toSats(0.1),
    {
      multisig: {
        rawtx: tx2,
        redeemScript: fixture.multisigWallet.BTC_3of3.redeemScript,
      }
    }
  );

  t.plan(1);
  t.equal(tx3, fixture.transaction.multisig.BTC_3of3_complete, 'should return raw hex');
});

test('src - transaction - ZEC multisig 1 of 2 (signature 1)', async (t) => {
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 419201,
    "currentHeight": 419201,
  }];
  
  const tx = transaction(
    fixture.multisigWallet.ZEC_1of2.address,
    fixture.multisigWallet.ZEC_1of2.address,
    wifKeysZEC[0],
    networks.zec,
    utxo,
    toSats(0.9),
    toSats(0.1),
    {
      multisig: {
        creator: true,
        redeemScript: fixture.multisigWallet.ZEC_1of2.redeemScript,
      }
    }
  );
  
  t.plan(1);
  t.equal(tx, fixture.transaction.multisig.ZEC_1of2_sig1, 'should return raw hex');
});

test('src - transaction - ZEC multisig 1 of 2 (signature 2)', async (t) => {
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 419201,
    "currentHeight": 419201,
  }];
  
  const tx = transaction(
    fixture.multisigWallet.ZEC_1of2.address,
    fixture.multisigWallet.ZEC_1of2.address,
    wifKeysZEC[1],
    networks.zec,
    utxo,
    toSats(0.9),
    toSats(0.1),
    {
      multisig: {
        creator: true,
        redeemScript: fixture.multisigWallet.ZEC_1of2.redeemScript,
      }
    }
  );

  t.plan(1);
  t.equal(tx, fixture.transaction.multisig.ZEC_1of2_sig2, 'should return raw hex');
});

test('src - transaction - ZEC multisig 2 of 2', async (t) => {
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 419201,
    "currentHeight": 419201,
  }];

  const tx = transaction(
    fixture.multisigWallet.ZEC_2of2.address,
    fixture.multisigWallet.ZEC_2of2.address,
    wifKeysZEC[0],
    networks.zec,
    utxo,
    toSats(0.9),
    toSats(0.1),
    {
      multisig: {
        incomplete: true,
        creator: true,
        redeemScript: fixture.multisigWallet.ZEC_2of2.redeemScript,
      }
    }
  );
  
  const tx2 = transaction(
    fixture.multisigWallet.ZEC_2of2.address,
    fixture.multisigWallet.ZEC_2of2.address,
    wifKeysZEC[1],
    networks.zec,
    utxo,
    toSats(0.9),
    toSats(0.1),
    {
      multisig: {
        rawtx: tx,
        redeemScript: fixture.multisigWallet.ZEC_2of2.redeemScript,
      }
    }
  );
  
  t.plan(1);
  t.equal(tx2, fixture.transaction.multisig.ZEC_2of2_complete, 'should return raw hex');
});

test('src - transaction - ZEC multisig 2 of 3', async (t) => {
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 419201,
    "currentHeight": 419201,
  }];

  const tx = transaction(
    fixture.multisigWallet.ZEC_2of3.address,
    fixture.multisigWallet.ZEC_2of3.address,
    wifKeysZEC[0],
    networks.zec,
    utxo,
    toSats(0.9),
    toSats(0.1),
    {
      multisig: {
        incomplete: true,
        creator: true,
        redeemScript: fixture.multisigWallet.ZEC_2of3.redeemScript,
      }
    }
  );
  
  const tx2 = transaction(
    fixture.multisigWallet.ZEC_2of3.address,
    fixture.multisigWallet.ZEC_2of3.address,
    wifKeysZEC[1],
    networks.zec,
    utxo,
    toSats(0.9),
    toSats(0.1),
    {
      multisig: {
        rawtx: tx,
        redeemScript: fixture.multisigWallet.ZEC_2of3.redeemScript,
      }
    }
  );

  t.plan(1);
  t.equal(tx2, fixture.transaction.multisig.ZEC_2of3_complete, 'should return raw hex');
});

test('src - transaction - ZEC multisig 3 of 3', async (t) => {
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 419201,
    "currentHeight": 419201,
  }];

  const tx = transaction(
    fixture.multisigWallet.ZEC_3of3.address,
    fixture.multisigWallet.ZEC_3of3.address,
    wifKeysZEC[0],
    networks.zec,
    utxo,
    toSats(0.9),
    toSats(0.1),
    {
      multisig: {
        incomplete: true,
        creator: true,
        redeemScript: fixture.multisigWallet.ZEC_3of3.redeemScript,
      }
    }
  );
  
  const tx2 = transaction(
    fixture.multisigWallet.ZEC_3of3.address,
    fixture.multisigWallet.ZEC_3of3.address,
    wifKeysZEC[1],
    networks.zec,
    utxo,
    toSats(0.9),
    toSats(0.1),
    {
      multisig: {
        incomplete: true,
        rawtx: tx,
        redeemScript: fixture.multisigWallet.ZEC_3of3.redeemScript,
      }
    }
  );
  
  const tx3 = transaction(
    fixture.multisigWallet.ZEC_3of3.address,
    fixture.multisigWallet.ZEC_3of3.address,
    wifKeysZEC[2],
    networks.zec,
    utxo,
    toSats(0.9),
    toSats(0.1),
    {
      multisig: {
        rawtx: tx2,
        redeemScript: fixture.multisigWallet.ZEC_3of3.redeemScript,
      }
    }
  );

  t.plan(1);
  t.equal(tx3, fixture.transaction.multisig.ZEC_3of3_complete, 'should return raw hex');
});

test('src - transaction - ZEC multisig 3 of 3 (out of order signatures)', async (t) => {
  const utxo = [{
    "txid": "33f61397abaf2f2bfd212d71432e5c9032b3033476e78d7ed1a654eb564639f9",
    "vout": 1,
    "value": toSats(1),
    "verified": true,
    "height": 419201,
    "currentHeight": 419201,
  }];

  const tx = transaction(
    fixture.multisigWallet.ZEC_3of3.address,
    fixture.multisigWallet.ZEC_3of3.address,
    wifKeysZEC[2],
    networks.zec,
    utxo,
    toSats(0.9),
    toSats(0.1),
    {
      multisig: {
        incomplete: true,
        creator: true,
        redeemScript: fixture.multisigWallet.ZEC_3of3.redeemScript,
      }
    }
  );
  
  const tx2 = transaction(
    fixture.multisigWallet.ZEC_3of3.address,
    fixture.multisigWallet.ZEC_3of3.address,
    wifKeysZEC[0],
    networks.zec,
    utxo,
    toSats(0.9),
    toSats(0.1),
    {
      multisig: {
        incomplete: true,
        rawtx: tx,
        redeemScript: fixture.multisigWallet.ZEC_3of3.redeemScript,
      }
    }
  );
  
  const tx3 = transaction(
    fixture.multisigWallet.ZEC_3of3.address,
    fixture.multisigWallet.ZEC_3of3.address,
    wifKeysZEC[1],
    networks.zec,
    utxo,
    toSats(0.9),
    toSats(0.1),
    {
      multisig: {
        rawtx: tx2,
        redeemScript: fixture.multisigWallet.ZEC_3of3.redeemScript,
      }
    }
  );

  t.plan(1);
  t.equal(tx3, fixture.transaction.multisig.ZEC_3of3_complete, 'should return raw hex');
});