// https://github.com/request/request/tree/master/tests

import test from 'tape';
import passphraseGenerator from '../crypto/passphrasegenerator';

test('src - passphrasegenerator - should throw entropy error', async (t) => {
  t.plan(1);
  t.throws(() => passphraseGenerator.generatePassPhrase(1), /Invalid entropy/);
});

test('src - passphrasegenerator - should throw bits is NaN error', async (t) => {
  t.plan(1);
  t.throws(() => passphraseGenerator.generatePassPhrase(), /bits is NaN/);
});

test('src - passphrasegenerator - should throw seed is empty error', async (t) => {
  t.plan(1);
  t.throws(() => passphraseGenerator.hasDuplicates(), /seed is empty/);
});

test('src - passphrasegenerator - should throw seed is empty error', async (t) => {
  t.plan(1);
  t.throws(() => passphraseGenerator.arePassPhraseWordsValid(), /seed is empty/);
});

test('src - passphrasegenerator - should throw seed is empty error', async (t) => {
  t.plan(1);
  t.throws(() => passphraseGenerator.isPassPhraseValid(), /seed is empty/);
});

test('src - passphrasegenerator - should throw bits is NaNy error', async (t) => {
  t.plan(1);
  t.throws(() => passphraseGenerator.isPassPhraseValid(' '), /bits is NaN/);
});

test('src - passphrasegenerator - should generate a valid 12 word seed', async (t) => {
  t.plan(1);
  t.equal(passphraseGenerator.generatePassPhrase(128).split(' ').length, 12);
});

test('src - passphrasegenerator - should generate a valid 24 word seed', async (t) => {
  t.plan(1);
  t.equal(passphraseGenerator.generatePassPhrase(256).split(' ').length, 24);
});

test('src - passphrasegenerator - should validate correct 24 word seed', async (t) => {
  t.plan(3);
  t.equal(passphraseGenerator.arePassPhraseWordsValid('grass chimney visit mail inmate enough mail nephew comfort sniff power original odor crouch act lemon slight knife usage suffer such weird spoil lonely'), false, 'arePassPhraseWordsValid');
  t.equal(passphraseGenerator.isPassPhraseValid('grass chimney visit mail inmate enough grief nephew comfort sniff power original odor crouch act lemon slight knife usage suffer such weird spoil lonely', 256), true, 'isPassPhraseValid');
  t.equal(passphraseGenerator.hasDuplicates('grass chimney visit mail inmate enough grief nephew comfort sniff power original odor crouch act lemon slight knife usage suffer such weird spoil lonely'), false, 'hasDuplicates');
});

test('src - passphrasegenerator - should invalidate incorrect 24 word seed', async (t) => {
  t.plan(3);
  t.equal(passphraseGenerator.isPassPhraseValid('grass chimney visit mail inmate enough mail nephew comfort sniff power original odor crouch act lemon slight knife usage suffer such weird spoil lonely', 256), true, 'isPassPhraseValid');
  t.equal(passphraseGenerator.arePassPhraseWordsValid('grass chimney visit mail inmate enough mail nephew comfort sniff power original odor crouch act lemon slight knife usage suffer such weird spoil lonely'), false, 'arePassPhraseWordsValid');
  t.equal(passphraseGenerator.hasDuplicates('grass chimney visit mail inmate enough mail nephew comfort sniff power original odor crouch act lemon slight knife usage suffer such weird spoil lonely'), true, 'hasDuplicates');
});