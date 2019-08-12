// https://github.com/request/request/tree/master/tests

import test from 'tape';
import md5 from '../crypto/md5';

test('src - md5 - should generate correct md5 hash string', async (t) => {
  t.plan(1);
  t.equal(md5('123'), '202cb962ac59075b964b07152d234b70', 'should produce a valid md5 string');
});