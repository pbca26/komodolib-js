// https://github.com/request/request/tree/master/tests

import test from 'tape';
import {
  maskPubAddress,
  hex2str,
  shuffleArray,
} from '../crypto/utils';

test('src - crypto utils - maskPubAddress', async (t) => {
  t.plan(1);
  t.equal(maskPubAddress('RRyBxbrAPRUBCUpiJgJZYrkxqrh8x5ta9Z'), 'RRy****************************a9Z', 'should return masked input');
});

test('src - crypto utils - hex2str', async (t) => {
  t.plan(1);
  t.equal(hex2str('313233'), '123', 'should convert hex to string');
});

test('src - crypto utils - shuffleArray', async (t) => {
  t.plan(1);
  t.notDeepEqual(shuffleArray([1, 2, 3]), [1, 2, 3], 'should return shuffled array');
});