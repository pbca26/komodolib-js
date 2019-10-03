// https://github.com/request/request/tree/master/tests

import test from 'tape';
import {
  checkTimestamp,
  secondsElapsedToString,
  secondsToString,
} from '../time';

const timeExample = 1519344000000; // 02/23/2018 @ 12:00am (UTC)
const timeExample2 = 1519344060000; // 02/23/2018 @ 12:01am (UTC)

test('src - time - checkTimestamp', async (t) => {
  t.plan(1);
  t.equal(checkTimestamp(timeExample, timeExample / 1000), 0, 'should return 0');
});

test('src - time - checkTimestamp 60s', async (t) => {
  t.plan(1);
  t.equal(checkTimestamp(timeExample, timeExample2 / 1000), 60, 'should 60');
});

test('src - time - secondsElapsedToString - 1s (singular)', async (t) => {
  t.plan(1);
  t.equal(secondsElapsedToString(Date.now() - 1000), '1 second', 'should be equal 1 second');
});

test('src - time - secondsElapsedToString - 10s (plural)', async (t) => {
  t.plan(1);
  t.equal(secondsElapsedToString(Date.now() - 10000), '10 seconds', 'should be equal 10 seconds');
});

test('src - time - secondsElapsedToString - 1 min (singular)', async (t) => {
  t.plan(1);
  t.equal(secondsElapsedToString(Date.now() - 60 * 1000), '1 minute', 'should be equal 1 minute');
});

test('src - time - secondsElapsedToString - 2 min (plural)', async (t) => {
  t.plan(1);
  t.equal(secondsElapsedToString(Date.now() - 2 * 60 * 1000), '2 minutes', 'should be equal 2 minuts');
});

test('src - time - secondsElapsedToString - 1h (singular)', async (t) => {
  t.plan(1);
  t.equal(secondsElapsedToString(Date.now() - 60 * 60 * 1000), '1 hour', 'should be equal 1 hour');
});

test('src - time - secondsElapsedToString - 2h (plural)', async (t) => {
  t.plan(1);
  t.equal(secondsElapsedToString(Date.now() - 2 * 60 * 60 * 1000), '2 hours', 'should be equal 2 hours');
});

test('src - time - secondsElapsedToString - 1d (singular)', async (t) => {
  t.plan(1);
  t.equal(secondsElapsedToString(Date.now() - 24 * 60 * 60 * 1000), '1 day', 'should be equal 1 day');
});

test('src - time - secondsElapsedToString - 2d (plural)', async (t) => {
  t.plan(1);
  t.equal(secondsElapsedToString(Date.now() - 48 * 60 * 60 * 1000), '2 days', 'should be equal 2 days');
});

test('src - time - secondsElapsedToString - 1w (singular)', async (t) => {
  t.plan(1);
  t.equal(secondsElapsedToString(Date.now() - 7 * 24 * 60 * 60 * 1000), '1 week', 'should be equal 1 week');
});

test('src - time - secondsElapsedToString - 2w (plural)', async (t) => {
  t.plan(1);
  t.equal(secondsElapsedToString(Date.now() - 14 * 24 * 60 * 60 * 1000), '2 weeks', 'should be equal 2 weeks');
});

test('src - time - secondsElapsedToString - 1m (singular)', async (t) => {
  t.plan(1);
  t.equal(secondsElapsedToString(Date.now() - 30 * 24 * 60 * 60 * 1000), '1 month', 'should be equal 1 month');
});

test('src - time - secondsElapsedToString - 2m (plural)', async (t) => {
  t.plan(1);
  t.equal(secondsElapsedToString(Date.now() - 60 * 24 * 60 * 60 * 1000), '2 months', 'should be equal 2 months');
});

test('src - time - secondsElapsedToString - 1y (singular)', async (t) => {
  t.plan(1);
  t.equal(secondsElapsedToString(Date.now() - 365 * 24 * 60 * 60 * 1000), '1 year', 'should be equal 1 year');
});

test('src - time - secondsElapsedToString - 2y (plural)', async (t) => {
  t.plan(1);
  t.equal(secondsElapsedToString(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000), '2 years', 'should be equal 2 years');
});

test('src - time - secondsElapsedToString - 1y 1m 1w 1d 1h 1m 1s', async (t) => {
  const year = 365 * 24 * 60 * 60;
  const month = 30 * 24 * 60 * 60;
  const week = 7 * 24 * 60 * 60;
  const day = 24 * 60 * 60;
  const hr = 60 * 60;
  const min = 60;
  const sec = 1;

  t.plan(1);
  t.equal(secondsElapsedToString(Date.now() - (year + month + week + day + hr + min + sec) * 1000), '1 year 1 month 1 week 1 day 1 hour 1 minute 1 second', 'should be equal 1 year 1 month 1 week 1 day 1 hour 1 minute 1 second');
});

test('src - time - secondsElapsedToString - 2y (plural) value in seconds', async (t) => {
  t.plan(1);
  t.equal(secondsElapsedToString(2 * 365 * 24 * 60 * 60, true), '2 years', 'should be equal 2 years');
});