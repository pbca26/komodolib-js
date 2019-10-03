// https://github.com/request/request/tree/master/tests

import test from 'tape';
import komodoInterest from '../komodo-interest';

test('src - time - komodoInterest - 30 min since locktime', async (t) => {
  t.plan(1);
  t.equal(komodoInterest(((Date.now() / 1000 - 3600 * 0.5)).toFixed(0), 100000, 1000000), 0, 'should be equal 0');
});

test('src - time - komodoInterest - 60 min since locktime', async (t) => {
  t.plan(1);
  t.equal(komodoInterest(((Date.now() / 1000 - 3600 * 1)).toFixed(0), 100000, 1000000), 0, 'should be equal 0');
});

test('src - time - komodoInterest - 120 min since locktime, less than 10 KMD UTXO', async (t) => {
  t.plan(1);
  t.equal(komodoInterest(((Date.now() / 1000 - 3600 * 2)).toFixed(0), 100000, 1000000), 0, 'should be equal 0');
});

test('src - time - komodoInterest - 120 min since locktime, 10 KMD UTXO', async (t) => {
  t.plan(1);
  t.equal(komodoInterest(Math.floor(Date.now() / 1000) - 3600 * 2, 10 * 100000000, 1000000), 0.00004565, 'should be equal 0.00004565');
});

test('src - time - komodoInterest - 120 min since locktime, 100000 KMD UTXO', async (t) => {
  t.plan(1);
  t.equal(komodoInterest(Math.floor(Date.now() / 1000) - 3600 * 2, 100000 * 100000000, 1000000), 0.45709629, 'should be equal 0.45709629');
});

test('src - time - komodoInterest - 120 min since locktime, 10 KMD UTXO, height < 1000000 (old rules)', async (t) => {
  t.plan(1);
  t.equal(komodoInterest(Math.floor(Date.now() / 1000) - 3600 * 24 * 60, 10 * 100000000, 999999), 0.08201165, 'should be equal 0.08201165 (accrue interest for 60 days)');
});

test('src - time - komodoInterest - 120 min since locktime, 10 KMD UTXO', async (t) => {
  t.plan(4);
  t.equal(komodoInterest(Math.floor(Date.now() / 1000) - 3600 * 24 * 30, 10 * 100000000, 1000000), 0.04097165, 'should be equal 0.04097165 (30 days)');
  t.equal(komodoInterest(Math.floor(Date.now() / 1000) - 3600 * 24 * 31 - 1000, 10 * 100000000, 1000000), 0.04235195, 'should be equal 0.04235195 (stop accruing interest past 31 days)');
  t.equal(komodoInterest(Math.floor(Date.now() / 1000) - 3600 * 24 * 35, 10 * 100000000, 1000000), 0.04235195, 'should be equal 0.04235195 (stop accruing interest past 31 days)');
  t.equal(komodoInterest(Math.floor(Date.now() / 1000) - 3600 * 24 * 360, 10 * 100000000, 1000000), 0.04235195, 'should be equal 0.04235195 (stop accruing interest past 31 days');
});