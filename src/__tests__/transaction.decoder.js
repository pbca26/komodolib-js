// https://github.com/request/request/tree/master/tests

import test from 'tape';
import fs from 'fs';
import transactionDecoder from '../transaction-decoder';
import networks from '../bitcoinjs-networks';
import jsonToBuffer from '../test.utils';
const fixture = JSON.parse(fs.readFileSync(__dirname + '/fixtures/transaction.decoder.json'));

test('src - transactionDecoder - BLK', async (t) => {
  const decodedTx = transactionDecoder(fixture.raw.BLK, networks.blk);
  const formattedFixture = jsonToBuffer(fixture.decoded.BLK);
  
  t.plan(7);
  t.deepEqual(decodedTx.tx.format, formattedFixture.tx.format, 'should match decoded BLK transaction (PoS, format)');
  t.equal(decodedTx.tx.time, formattedFixture.tx.time, 'should match decoded BLK transaction (PoS, time)');
  t.equal(decodedTx.tx.locktime, formattedFixture.tx.locktime, 'should match decoded BLK transaction (PoS, locktime)');
  t.equal(decodedTx.tx.version, formattedFixture.tx.version, 'should match decoded BLK transaction (PoS, version)');
  t.deepEqual(decodedTx.tx.network, formattedFixture.tx.network, 'should match decoded BLK transaction (PoS, network)');
  t.deepEqual(decodedTx.inputs, formattedFixture.inputs, 'should match decoded BLK transaction (PoS, inputs)');
  t.deepEqual(decodedTx.outputs, formattedFixture.outputs, 'should match decoded BLK transaction (PoS, outputs)');
});

test('src - transactionDecoder - KMD', async (t) => {
  const decodedTx = transactionDecoder(fixture.raw.KMD, networks.kmd);
  const formattedFixture = jsonToBuffer(fixture.decoded.KMD);
  
  t.plan(6);
  t.deepEqual(decodedTx.tx.format, formattedFixture.tx.format, 'should match decoded KMD transaction (Sapling v1, format)');
  t.equal(decodedTx.tx.locktime, formattedFixture.tx.locktime, 'should match decoded KMD transaction (Sapling v1, time)');
  t.equal(decodedTx.tx.version, formattedFixture.tx.version, 'should match decoded KMD transaction (Sapling v1, version)');
  t.deepEqual(decodedTx.tx.network, formattedFixture.tx.network, 'should match decoded KMD transaction (Sapling v1, network)');
  t.deepEqual(decodedTx.inputs, formattedFixture.inputs, 'should match decoded KMD transaction (Sapling v1, inputs)');
  t.deepEqual(decodedTx.outputs, formattedFixture.outputs, 'should match decoded KMD transaction (Sapling v1, outputs)');
});

test('src - transactionDecoder - GRS', async (t) => {
  const formattedFixture = jsonToBuffer(fixture.decoded.GRS);
  let decodedTx = transactionDecoder(fixture.raw.GRS, networks.grs);
  decodedTx.tx.network.hashFunctions = {};

  t.plan(6);
  t.deepEqual(decodedTx.tx.format, formattedFixture.tx.format, 'should match decoded GRS transaction (GRS, format)');
  t.equal(decodedTx.tx.locktime, formattedFixture.tx.locktime, 'should match decoded GRS transaction (GRS, time)');
  t.equal(decodedTx.tx.version, formattedFixture.tx.version, 'should match decoded GRS transaction (GRS, version)');
  t.deepEqual(decodedTx.tx.network, formattedFixture.tx.network, 'should match decoded GRS transaction (GRS, network)');
  t.deepEqual(decodedTx.tx.inputs, formattedFixture.tx.inputs, 'should match decoded GRS transaction (GRS, inputs)');
  t.deepEqual(decodedTx.tx.outputs, formattedFixture.tx.outputs, 'should match decoded GRS transaction (GRS, outputs)');
});

test('src - transactionDecoder - BTC', async (t) => {
  const formattedFixture = jsonToBuffer(fixture.decoded.BTC);
  const decodedTx = transactionDecoder(fixture.raw.BTC, networks.btc);

  t.plan(6);
  t.deepEqual(decodedTx.tx.format, formattedFixture.tx.format, 'should match decoded BTC transaction (format)');
  t.equal(decodedTx.tx.locktime, formattedFixture.tx.locktime, 'should match decoded BTC transaction (time)');
  t.equal(decodedTx.tx.version, formattedFixture.tx.version, 'should match decoded BTC transaction (version)');
  t.deepEqual(decodedTx.tx.network, formattedFixture.tx.network, 'should match decoded BTC transaction (network)');
  t.deepEqual(decodedTx.tx.inputs, formattedFixture.tx.inputs, 'should match decoded BTC transaction (inputs)');
  t.deepEqual(decodedTx.tx.outputs, formattedFixture.tx.outputs, 'should match decoded BTC transaction (outputs)');
});

test('src - transactionDecoder - ZEC', async (t) => {
  const decodedTx = transactionDecoder(fixture.raw.ZEC, networks.zec);
  const formattedFixture = jsonToBuffer(fixture.decoded.ZEC);
  
  t.plan(8);
  t.deepEqual(decodedTx.tx.format, formattedFixture.tx.format, 'should match decoded ZEC transaction (Sapling v4, format)');
  t.deepEqual(decodedTx.tx.locktime, formattedFixture.tx.locktime, 'should match decoded ZEC transaction (Sapling v4, time)');
  t.deepEqual(decodedTx.tx.version, formattedFixture.tx.version, 'should match decoded ZEC transaction (Sapling v4, version)');
  t.deepEqual(decodedTx.tx.network, formattedFixture.tx.network, 'should match decoded ZEC transaction (Sapling v4, network)');
  t.deepEqual(decodedTx.tx.overwintered, formattedFixture.tx.overwintered, 'should match decoded ZEC transaction (Sapling v4, overwintered)');
  t.deepEqual(decodedTx.tx.versionGroupId, formattedFixture.tx.versionGroupId, 'should match decoded ZEC transaction (Sapling v4, versionGroupId)');
  t.deepEqual(decodedTx.inputs, formattedFixture.inputs, 'should match decoded ZEC transaction (Sapling v4, inputs)');
  t.deepEqual(decodedTx.outputs, formattedFixture.outputs, 'should match decoded ZEC transaction (Sapling v4, outputs)');
});