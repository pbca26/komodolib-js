// https://github.com/request/request/tree/master/tests

import test from 'tape';
import aes256 from 'nodejs-aes256';
import {
  encrypt,
  decrypt,
} from '../crypto/cryptstr';

const ckey = '123';
const str = 'test';

test('src - crypto cryptstr - encrypt', async (t) => {
  const encrypted = await encrypt(ckey, str);

  t.plan(1);
  t.equal(encrypted.length, 146, 'should have fixed len 146');
  t.plan(2);
  t.equal(encrypted.indexOf('$300000$cbc'), 135, 'should contain cbc encryption method and 300000 rounds value');
});

test('src - crypto cryptstr - decrypt', async (t) => {
  const encrypted = await encrypt(ckey, str);
  const decrypted = await decrypt(ckey, encrypted);

  t.plan(1);
  t.equal(decrypted, str, 'should decrypt string');
});

test('src - crypto cryptstr - decrypt - legacy method', async (t) => {
  const encrypted = aes256.encrypt(ckey, str);
  const decrypted = await decrypt(ckey, encrypted);

  t.plan(1);
  t.equal(decrypted.hasOwnProperty('old'), true, 'should have old prop');
  t.plan(2);
  t.equal(decrypted.old, true, 'should have old prop = true');
  t.plan(3);
  t.equal(decrypted.string, str, 'should decrypt string');
});

test('src - crypto cryptstr - encrypt', async (t) => {
  const encrypted = await encrypt(ckey, str, true);

  t.plan(1);
  t.equal(encrypted, -1, 'should reject weak encryption key');
});