// https://github.com/request/request/tree/master/tests

import test from 'tape';
import fs from 'fs';
import {
  btc,
  eth,
} from '../message';
const fixture = JSON.parse(fs.readFileSync(__dirname + '/fixtures/message.json'));

test('src - signBTC - BTC signature', async (t) => {
  const btcWIF = 'L2LCi8MKjzRkipcpj4bRgpMyf8yQCfev6SQRmPP2ewvgS6fGEbMb';
  const signature = btc.sign(btcWIF, 'test');

  t.plan(1);
  t.equal(signature, fixture.BTC, 'should match BTC signature');
});

test('src - signBTC - KMD signature', async (t) => {
  const kmdWIF = 'Uu831oyJFDQ1BsQuucH1TG3CbD2YHmvXrwnFLeAi7f9PKxcmGri3';
  const signature = btc.sign(kmdWIF, 'test');

  t.plan(1);
  t.equal(signature, fixture.BTC, 'should match BTC signature');
});

test('src - signBTC - ZEC signature', async (t) => {
  const zecWIF = 'L2LCi8MKjzRkipcpj4bRgpMyf8yQCfev6SQRmPP2ewvgS6fGEbMb';
  const signature = btc.sign(zecWIF, 'test', true);

  t.plan(1);
  t.notEqual(signature, fixture.BTC, 'should produce different signature for ZEC');
});

test('src - verifyBTC - verify BTC signature', async (t) => {
  const btcWIF = 'L2LCi8MKjzRkipcpj4bRgpMyf8yQCfev6SQRmPP2ewvgS6fGEbMb';
  const validSignature = btc.verify(
    '1Hgzt5xsnbfc8UTWqWKSTLRm5bEYHYBoCE',
    'test',
    fixture.BTC
  );
  const invalidSignatureAddress = btc.verify(
    '1DHFXScNHcP6XEM1EdwcbZaTZtZbLhcLPP',
    'test',
    fixture.BTC
  );
  const invalidSignatureMessage = btc.verify(
    '1Hgzt5xsnbfc8UTWqWKSTLRm5bEYHYBoCE',
    'test1',
    fixture.BTC
  );
  
  const btcWIF2 = 'Kx2xsJCCu3JQLM9nAc3W6bYc58gHh8kernMW3GcTZowsJy299dRH';
  const signature = btc.sign(btcWIF2, 'test1');
  const invalidSignature = btc.verify(
    '1DHFXScNHcP6XEM1EdwcbZaTZtZbLhcLPP',
    'test',
    fixture.BTC
  );

  t.plan(4);
  t.equal(validSignature, true, 'should validate BTC signature');
  t.equal(invalidSignatureAddress, false, 'should invalidate BTC signature (wrong address)');
  t.equal(invalidSignatureMessage, false, 'should invalidate BTC signature (wrong message)');
  t.equal(invalidSignature, false, 'should invalidate BTC signature');
});

test('src - verifyBTC - verify KMD signature', async (t) => {
  const btcWIF = 'Uu831oyJFDQ1BsQuucH1TG3CbD2YHmvXrwnFLeAi7f9PKxcmGri3';
  const validSignature = btc.verify(
    '1Hgzt5xsnbfc8UTWqWKSTLRm5bEYHYBoCE',
    'test',
    fixture.BTC
  );
  const invalidSignatureAddress = btc.verify(
    '1DHFXScNHcP6XEM1EdwcbZaTZtZbLhcLPP',
    'test',
    fixture.BTC
  );
  const invalidSignatureMessage = btc.verify(
    '1Hgzt5xsnbfc8UTWqWKSTLRm5bEYHYBoCE',
    'test1',
    fixture.BTC
  );
  
  const btcWIF2 = 'Kx2xsJCCu3JQLM9nAc3W6bYc58gHh8kernMW3GcTZowsJy299dRH';
  const signature = btc.sign(btcWIF2, 'test1');
  const invalidSignature = btc.verify(
    '1DHFXScNHcP6XEM1EdwcbZaTZtZbLhcLPP',
    'test',
    fixture.BTC
  );

  t.plan(4);
  t.equal(validSignature, true, 'should validate KMD signature');
  t.equal(invalidSignatureAddress, false, 'should invalidate KMD signature (wrong address)');
  t.equal(invalidSignatureMessage, false, 'should invalidate KMD signature (wrong message)');
  t.equal(invalidSignature, false, 'should invalidate KMD signature');
});

test('src - verifyBTC - verify ZEC signature', async (t) => {
  const zecWIF = 'L2LCi8MKjzRkipcpj4bRgpMyf8yQCfev6SQRmPP2ewvgS6fGEbMb';
  const signature = btc.sign(zecWIF, 'test', true);

  const validSignature = btc.verify(
    't1aZbtRP1kvTCj7WQmw8Zb9XgLFRd7rtthy',
    'test',
    signature,
    true
  );
  const invalidSignatureAddress = btc.verify(
    't1W9rXn2WFwAh7sPuB4kjjNgNpYkg6LKvM3',
    'test',
    signature,
    true
  );
  const invalidSignatureMessage = btc.verify(
    't1aZbtRP1kvTCj7WQmw8Zb9XgLFRd7rtthy',
    'test1',
    signature,
    true
  );
  
  const btcWIF2 = 'Kx2xsJCCu3JQLM9nAc3W6bYc58gHh8kernMW3GcTZowsJy299dRH';
  const signature2 = btc.sign(btcWIF2, 'test1');
  const invalidSignature = btc.verify(
    't1W9rXn2WFwAh7sPuB4kjjNgNpYkg6LKvM3',
    'test',
    signature2,
    true
  );

  t.plan(4);
  t.equal(validSignature, true, 'should validate ZEC signature');
  t.equal(invalidSignatureAddress, false, 'should invalidate ZEC signature (wrong address)');
  t.equal(invalidSignatureMessage, false, 'should invalidate ZEC signature (wrong message)');
  t.equal(invalidSignature, false, 'should invalidate ZEC signature');
});

test('src - signETH', async (t) => {
  const ethPriv = '0x9886d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a48';
  const signature = eth.sign(ethPriv, 'test');

  t.plan(1);
  t.equal(signature, fixture.ETH, 'should match ETH signature');
});

test('src - verifyETH - verify ETH signature', async (t) => {
  const ethPriv = '0x9886d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a48';
  const signature = eth.sign(ethPriv, 'test');

  const validSignature = eth.verify(
    '0xA3628fDa345ADAB6e91384d6fFDf86C120771530',
    'test',
    signature,
  );
  const invalidSignatureAddress = eth.verify(
    '0xC6a8D4eFFC91d20A5e12C25f95918058BAb11D94',
    'test',
    signature,
  );
  const invalidSignatureMessage = eth.verify(
    '0xA3628fDa345ADAB6e91384d6fFDf86C120771530',
    'test1',
    signature,
  );
  
  const ethPriv2 = '0x184f0e9851971998e732078544c96b36c3d01cedf7caa332359d6f1d83567054';
  const signature2 = eth.sign(ethPriv2, 'test1');
  const invalidSignature = eth.verify(
    '0xC6a8D4eFFC91d20A5e12C25f95918058BAb11D94',
    'test',
    signature2
  );

  t.plan(4);
  t.equal(validSignature, true, 'should validate ETH signature');
  t.equal(invalidSignatureAddress, false, 'should invalidate ETH signature (wrong address)');
  t.equal(invalidSignatureMessage, false, 'should invalidate ETH signature (wrong message)');
  t.equal(invalidSignature, false, 'should invalidate ETH signature');
});