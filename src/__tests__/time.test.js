// https://github.com/request/request/tree/master/tests

import test from 'tape';

const { checkTimestamp } = require('../time');

const timeExample = 1519344000000; // 02/23/2018 @ 12:00am (UTC)

test('src - time - checkTimestamp', async (t) => {
  t.plan(1);
  t.equal(checkTimestamp(timeExample, timeExample / 1000), 0);
});
