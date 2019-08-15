// https://github.com/request/request/tree/master/tests

import test from 'tape';
import fs from 'fs';
import transactionType from '../transaction-type';
const fixture = JSON.parse(fs.readFileSync(__dirname + '/fixtures/transaction.type.json'));

test('src - transactionType - KMD', async (t) => {
  let redactedTransaction = JSON.parse(JSON.stringify(fixture.KMD.transaction));
  delete redactedTransaction.confirmations;
  delete redactedTransaction.timestamp;
  
  const decodedTxPartial = transactionType(redactedTransaction);
  
  t.plan(1);
  t.deepEqual(decodedTxPartial, fixture.KMD.decodedPartial, 'should match partially decoded KMD transaction');
});

test('src - transactionType - KMD', async (t) => {
  const decodedTxFull = transactionType(fixture.KMD.transaction, 'RDbGxL8QYdEp8sMULaVZS2E6XThcTKT9Jd');
  
  t.plan(1);
  t.deepEqual(decodedTxFull, fixture.KMD.decodedFull, 'should match fully decoded KMD transaction with target address');
});

test('src - transactionType - KMD - skipTargetAddress', async (t) => {  
  const decodedTxFull = transactionType(fixture.KMD.transaction, 'RDbGxL8QYdEp8sMULaVZS2E6XThcTKT9Jd', { skipTargetAddress: true });
  
  t.plan(1);
  t.deepEqual(decodedTxFull, fixture.KMD.decodedFullSkip, 'should match fully decoded KMD transaction (skipTargetAddress option)');
});

test('src - transactionType - KMD - isKomodo', async (t) => {
  let redactedTransaction = JSON.parse(JSON.stringify(fixture.KMD.transaction));
  redactedTransaction.outputs[0].value = 1;  

  const decodedTxFull = transactionType(redactedTransaction, 'RDbGxL8QYdEp8sMULaVZS2E6XThcTKT9Jd', { isKomodo: true });
  
  t.plan(1);
  t.deepEqual(decodedTxFull, fixture.KMD.decodedFullIsKomodo, 'should match fully decoded KMD transaction (isKomodo option)');
});

test('src - transactionType - KMD - isKomodo', async (t) => {
  const decodedTxFull = transactionType(fixture.KMD.transactionSelf, 'RDbGxL8QYdEp8sMULaVZS2E6XThcTKT9Jd', { isKomodo: true });
  
  t.plan(1);
  t.deepEqual(decodedTxFull, fixture.KMD.decodedFullInterestSelf, 'should match fully decoded KMD transaction (isKomodo option, interest)');
});

test('src - transactionType - KMD', async (t) => {
  const decodedTxFull = transactionType(fixture.KMD.transactionSelf, 'RDbGxL8QYdEp8sMULaVZS2E6XThcTKT9Jd');
  
  t.plan(1);
  t.deepEqual(decodedTxFull, fixture.KMD.decodedFullSelf, 'should match fully decoded KMD transaction (self)');
});

test('src - transactionType - KMD', async (t) => {
  const decodedTxFull = transactionType(fixture.KMD.transactionSent, 'RDbGxL8QYdEp8sMULaVZS2E6XThcTKT9Jd');
  
  t.plan(1);
  t.deepEqual(decodedTxFull, fixture.KMD.decodedFullSent, 'should match fully decoded KMD transaction (sent)');
});

test('src - transactionType - BTC', async (t) => {
  let redactedTransaction = JSON.parse(JSON.stringify(fixture.BTC.transaction));
  delete redactedTransaction.confirmations;
  delete redactedTransaction.timestamp;
  
  const decodedTxPartial = transactionType(redactedTransaction);
  
  t.plan(1);
  t.deepEqual(decodedTxPartial, fixture.BTC.decodedPartial, 'should match partially decoded BTC transaction');
});

test('src - transactionType - BTC', async (t) => {
  const decodedTxFull = transactionType(fixture.BTC.transaction, '15K5spF7woSF4rzGsQWSLVttmCF1nGGDXe');
  
  t.plan(1);
  t.deepEqual(decodedTxFull, fixture.BTC.decodedFull, 'should match fully decoded BTC transaction with target address');
});

test('src - transactionType - BTC - skipTargetAddress', async (t) => {  
  const decodedTxFull = transactionType(fixture.BTC.transaction, '15K5spF7woSF4rzGsQWSLVttmCF1nGGDXe', { skipTargetAddress: true });
  
  t.plan(1);
  t.deepEqual(decodedTxFull, fixture.BTC.decodedFullSkip, 'should match fully decoded BTC transaction (skipTargetAddress option)');
});

test('src - transactionType - BTC', async (t) => {
  const decodedTxFull = transactionType(fixture.BTC.transactionSelf, '15K5spF7woSF4rzGsQWSLVttmCF1nGGDXe');
  
  t.plan(1);
  t.deepEqual(decodedTxFull, fixture.BTC.decodedFullSelf, 'should match fully decoded BTC transaction (self)');
});

test('src - transactionType - BTC', async (t) => {
  const decodedTxFull = transactionType(fixture.BTC.transactionSent, '15K5spF7woSF4rzGsQWSLVttmCF1nGGDXe');
  
  t.plan(1);
  t.deepEqual(decodedTxFull, fixture.BTC.decodedFullSent, 'should match fully decoded BTC transaction (sent)');
});