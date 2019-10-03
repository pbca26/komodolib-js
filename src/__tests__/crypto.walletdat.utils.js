// https://github.com/request/request/tree/master/tests

import test from 'tape';
import parseWalletdat from '../crypto/walletdat-utils';

const privkey = 'E9873D79C6D87DC0FB6A5778633389F4453213303DA61F20BD67FC233AA33262';
const walletDat = '\x30\x81\xD3\x02\x01\x01\x04\x20' + privkey;
const walletDatNoKey = '\x30\x81\xD3\x02\x01\x01\x04\x20';
const walletDatWrongKeyLen = '\x30\x81\xD3\x02\x01\x01\x04\x20' + privkey.substr(0, 10);
const keyPair = {
  'kmd': [{
    priv: 'UrL747QiFwbAAwaHddqFLE2Wf8MM4fVBwoy59EBj5PxhMeaRwVMW',
    pub: 'RDDLHwLxLKm5b4hEPdmrhUQ5cBSHZsdeyK',
  }],
  'btc': [{
    priv: 'KyYGkRnjkicuhtnCT69fZnMHj4JCyZDaBJbFZyQ3cgjzTncpYRuV',
    pub: '14w9DRTfjVxWX4L2vTnjbx4squygukEvK8'
  }]
};

test('src - crypto walletdat utils - parseWalletDat - malformed contents or encrypted', async (t) => {
  t.plan(1);
  t.equal(parseWalletdat(walletDatNoKey), 'wallet is encrypted or malformed contents', 'should return an error');
});

test('src - crypto walletdat utils - parseWalletDat - wrong priv key', async (t) => {
  t.plan(1);
  t.equal(parseWalletdat(walletDatWrongKeyLen), 'wallet is encrypted or malformed contents', 'should return an error');
});

test('src - crypto walletdat utils - parseWalletDat KMD', async (t) => {
  t.plan(1);
  t.deepEqual(parseWalletdat(walletDat), keyPair.kmd, 'should return KMD key pair');
});

test('src - crypto walletdat utils - parseWalletDat BTC', async (t) => {
  t.plan(1);
  t.deepEqual(parseWalletdat(walletDat, 'btc'), keyPair.btc, 'should return BTC key pair');
});

test('src - crypto walletdat utils - parseWalletDat KMD search no match', async (t) => {
  t.plan(1);
  t.deepEqual(parseWalletdat(walletDat, 'kmd', '123'), [], 'should return an empty array');
});

test('src - crypto walletdat utils - parseWalletDat KMD search match', async (t) => {
  t.plan(1);
  t.deepEqual(parseWalletdat(walletDat, 'kmd', keyPair.kmd.pub), keyPair.kmd, 'should return KMD key pair');
});