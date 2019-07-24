// https://github.com/request/request/tree/master/tests

import test from 'tape';
import { isKomodoCoin } from '../coin-helpers';

test('src - coin helpers - isKomodoCoin - 123', async (t) => {
  t.plan(1);
  t.equal(isKomodoCoin('123'), false, 'should return false');
});

test('src - coin helpers - isKomodoCoin - KMD', async (t) => {
  t.plan(1);
  t.equal(isKomodoCoin('KMD'), true, 'should return true');
});

test('src - coin helpers - isKomodoCoin - kmd', async (t) => {
  t.plan(1);
  t.equal(isKomodoCoin('kmd'), true, 'should return true');
});

test('src - coin helpers - isKomodoCoin - BET', async (t) => {
  t.plan(1);
  t.equal(isKomodoCoin('BET'), true, 'should return true');
});

test('src - coin helpers - isKomodoCoin - CHIPS', async (t) => {
  t.plan(1);
  t.equal(isKomodoCoin('CHIPS'), false, 'should return false');
});