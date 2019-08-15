// https://github.com/request/request/tree/master/tests

import test from 'tape';
import {
  formatValue,
  formatBytes,
  sort,
  sortTransactions,
  getRandomIntInclusive,
  getRandomElectrumServer,
  estimateTxSize,
  maxSpendBalance,
  fromSats,
  toSats,
  isNumber,
  isPositiveNumber,
  sortObject,
  parseBitcoinURL,
  convertExponentialToDecimal,
} from '../utils';
import electrumServers from '../electrum-servers';

test('src - formatValue - int num', async (t) => {
  t.plan(2);
  t.equal(formatValue(1), 1, 'should be equal 1');
  t.equal(formatValue(1.0), 1, 'should be equal 1');
});

test('src - formatValue - float num', async (t) => {
  t.plan(3);
  t.equal(formatValue(1.1), 1.1, 'should be equal 1.1');
  t.equal(formatValue(1.2000), 1.2, 'should be equal 1.2');
  t.equal(formatValue(1.123456789), 1.1235, 'should be equal 1.1235');
});

test('src - formatBytes', async (t) => {
  t.plan(9);
  t.equal(formatBytes(2), '2 Bytes', 'should be equal 2 Bytes');
  t.equal(formatBytes(2 * Math.pow(10, 3)), '2 KB', 'should be equal 2 KB');
  t.equal(formatBytes(2 * Math.pow(10, 6)), '2 MB', 'should be equal 2 MB');
  t.equal(formatBytes(2 * Math.pow(10, 9)), '2 GB', 'should be equal 2 GB');
  t.equal(formatBytes(2 * Math.pow(10, 12)), '2 TB', 'should be equal 2 TB');
  t.equal(formatBytes(2 * Math.pow(10, 15)), '2 PB', 'should be equal 2 PB');
  t.equal(formatBytes(2 * Math.pow(10, 18)), '2 EB', 'should be equal 2 EB');
  t.equal(formatBytes(2 * Math.pow(10, 21)), '2 ZB', 'should be equal 2 ZB');
  t.equal(formatBytes(2 * Math.pow(10, 24)), '2 YB', 'should be equal 2 YB');
});

test('src sort - sort by number prop', async (t) => {
  const original = [{
    num: 1,
    text: 'one',
  }, {
    num: 2,
    text: 'two',
  }, {
    num: 3,
    text: 'three',
  }];
  const reversed = [{
    num: 3,
    text: 'three',
  }, {
    num: 2,
    text: 'two',
  }, {
    num: 1,
    text: 'one',
  }];
  
  t.plan(4);
  t.deepEqual(sort(JSON.parse(JSON.stringify(original)), 'num'), JSON.parse(JSON.stringify(original)), 'should be equal to original');
  t.deepEqual(sort(JSON.parse(JSON.stringify(original)), 'num', true), JSON.parse(JSON.stringify(reversed)), 'should be equal to reversed');
  t.deepEqual(sort(JSON.parse(JSON.stringify(reversed)), 'num'), JSON.parse(JSON.stringify(original)), 'should be equal original');
  t.deepEqual(sort(JSON.parse(JSON.stringify(reversed)), 'num', true), JSON.parse(JSON.stringify(reversed)), 'should be equal to reversed');
});

test('src - sort - sort by text prop', async (t) => {
  const original = [{
    num: 1,
    text: 'abc',
  }, {
    num: 2,
    text: 'abd',
  }, {
    num: 3,
    text: 'abe',
  }];
  const reversed = [{
    num: 3,
    text: 'abe',
  }, {
    num: 2,
    text: 'abd',
  }, {
    num: 1,
    text: 'abc',
  }];
  
  t.plan(4);
  t.deepEqual(sort(JSON.parse(JSON.stringify(original)), 'num'), JSON.parse(JSON.stringify(original)), 'should be equal to original');
  t.deepEqual(sort(JSON.parse(JSON.stringify(original)), 'num', true), JSON.parse(JSON.stringify(reversed)), 'should be equal to reversed');
  t.deepEqual(sort(JSON.parse(JSON.stringify(reversed)), 'num'), JSON.parse(JSON.stringify(original)), 'should be equal original');
  t.deepEqual(sort(JSON.parse(JSON.stringify(reversed)), 'num', true), JSON.parse(JSON.stringify(reversed)), 'should be equal to reversed');
});

test('src - sortTransactions', async (t) => {
  const original = [{
    height: 1,
    confirmations: 1,
    txid: 'test1',
  }, {
    height: 2,
    confirmations: 2,
    txid: 'test2',
  }, {
    height: 3,
    confirmations: 3,
    txid: 'test3',
  }, {
    height: 3,
    confirmations: 3,
    txid: 'test4',
  }];
  const reversed = [{
    height: 3,
    confirmations: 3,
    txid: 'test3',
  }, {
    height: 3,
    confirmations: 3,
    txid: 'test4',
  }, {
    height: 2,
    confirmations: 2,
    txid: 'test2',
  }, {
    height: 1,
    confirmations: 1,
    txid: 'test1',
  }];
  
  t.plan(3);
  t.deepEqual(sortTransactions(JSON.parse(JSON.stringify(original))), JSON.parse(JSON.stringify(reversed)), 'should be equal to reversed');
  t.deepEqual(sortTransactions(sortTransactions(JSON.parse(JSON.stringify(original)))), JSON.parse(JSON.stringify(reversed)), 'should be equal to original (double sort)');
  t.deepEqual(sortTransactions(JSON.parse(JSON.stringify(original)), 'confirmations'), JSON.parse(JSON.stringify(reversed)), 'should be equal to reversed');
});

test('src - getRandomIntInclusive', async (t) => {
  t.plan(1);
  t.equal(getRandomIntInclusive(1, 1), 1, 'should be equal 1');
});

test('src - getRandomElectrumServer', async (t) => {
  t.plan(2);
  t.deepEqual(getRandomElectrumServer([electrumServers.kmd.serverList[0], electrumServers.kmd.serverList[0]]), { ip: 'electrum1.cipig.net', port: '10001', proto: 'tcp' }, 'should be equal to { ip: \'electrum1.cipig.net\', port: \'10001\', proto: \'tcp\' }');
  t.deepEqual(getRandomElectrumServer([electrumServers.kmd.serverList[0], electrumServers.kmd.serverList[1]], electrumServers.kmd.serverList[1]), { ip: 'electrum1.cipig.net', port: '10001', proto: 'tcp' }, 'should be equal to { ip: \'electrum1.cipig.net\', port: \'10001\', proto: \'tcp\' } (exclude)');
});

test('src - estimateTxSize', async (t) => {
  t.plan(3);
  t.equal(estimateTxSize(0, 0), 11, 'should be equal 11');
  t.equal(estimateTxSize(1, 1), 225, 'should be equal 225');
  t.equal(estimateTxSize(2, 5), 541, 'should be equal 541');
});

test('src - maxSpendBalance', async (t) => {
  const utxo = [{
    value: '1',
  }, {
    value: '2',
  }];

  t.plan(3);
  t.equal(maxSpendBalance(utxo, 0.1), 2.9, 'should be equal 2.9');
  t.equal(maxSpendBalance(utxo, 2.9), 0.1, 'should be equal 0.1');
  t.equal(maxSpendBalance(utxo), 3, 'should be equal 3');
});

test('src - fromSats', async (t) => {
  t.plan(9);
  t.equal(fromSats(1), convertExponentialToDecimal(0.00000001), 'should be equal 0.00000001');
  t.equal(fromSats(1 * Math.pow(10, 1)), convertExponentialToDecimal(0.0000001), 'should be equal 0.0000001');
  t.equal(fromSats(1 * Math.pow(10, 2)), convertExponentialToDecimal(0.000001), 'should be equal 0.000001');
  t.equal(fromSats(1 * Math.pow(10, 3)), 0.00001, 'should be equal 0.00001');
  t.equal(fromSats(1 * Math.pow(10, 4)), 0.0001, 'should be equal 0.0001');
  t.equal(fromSats(1 * Math.pow(10, 5)), 0.001, 'should be equal 0.001');
  t.equal(fromSats(1 * Math.pow(10, 6)), 0.01, 'should be equal 0.01');
  t.equal(fromSats(1 * Math.pow(10, 7)), 0.1, 'should be equal 0.1');
  t.equal(fromSats(1 * Math.pow(10, 8)), 1, 'should be equal 1');
});

test('src - toSats', async (t) => {
  t.plan(11);
  t.equal(toSats(Math.pow(10, -8)), 1, 'should be equal 1');
  t.equal(toSats(Math.pow(10, -7)), 10, 'should be equal 100');
  t.equal(toSats(Math.pow(10, -6)), 100, 'should be equal 100');
  t.equal(toSats(Math.pow(10, -5)), 1000, 'should be equal 1000');
  t.equal(toSats(Math.pow(10, -4)), 10000, 'should be equal 10000');
  t.equal(toSats(Math.pow(10, -3)), 100000, 'should be equal 100000');
  t.equal(toSats(Math.pow(10, -2)), 1000000, 'should be equal 1000000');
  t.equal(toSats(Math.pow(10, -1)), 10000000, 'should be equal 10000000');
  t.equal(toSats(1), Math.pow(10, 8), 'should be equal 100000000');
  t.equal(toSats(10), Math.pow(10, 9), 'should be equal 1000000000');
  t.equal(toSats(100), Math.pow(10, 10), 'should be equal 10000000000');
});

test('src - isNumber', async (t) => {
  t.plan(6);
  t.equal(isNumber(0), true, 'should be equal true');
  t.equal(isNumber(1), true, 'should be equal true');
  t.equal(isNumber(-1), true, 'should be equal true');
  t.equal(isNumber('123'), true, 'should be equal true');
  t.equal(isNumber('123a'), false, 'should be equal false');
  t.equal(isNumber(''), false, 'should be equal false');
});

test('src - isPositiveNumber', async (t) => {
  t.plan(6);
  t.equal(isPositiveNumber(0), false, 'should be equal false');
  t.equal(isPositiveNumber(1), true, 'should be equal true');
  t.equal(isPositiveNumber(-1), false, 'should be equal false');
  t.equal(isPositiveNumber('123'), true, 'should be equal true');
  t.equal(isPositiveNumber('123a'), false, 'should be equal false');
  t.equal(isPositiveNumber(''), false, 'should be equal false');
});

test('src - sortObject', async (t) => {
  const originalObj = {
    xyz: 'xyz',
    abc: 'abc',
    aab: 'aab',
  };
  const sortObj = {
    aab: 'aab',
    abc: 'abc',
    xyz: 'xyz',
  };

  t.plan(1);
  t.deepEqual(sortObject(originalObj), sortObj, 'should be equal sortObj');
});

test('src - parseBitcoinURL', async (t) => {
  const parsedBTCUrl = {
    url: 'bitcoin:1Hgzt5xsnbfc8UTWqWKSTLRm5bEYHYBoCE?amount=10&message=test',
    amount: '10',
    message: 'test',
    address: '1Hgzt5xsnbfc8UTWqWKSTLRm5bEYHYBoCE',
  };
  const parsedKMDUrl = {
    url: 'komodo:RRyBxbrAPRUBCUpiJgJZYrkxqrh8x5ta9Z?amount=10&message=test',
    amount: '10',
    message: 'test',
    address: 'RRyBxbrAPRUBCUpiJgJZYrkxqrh8x5ta9Z',
  };

  t.plan(3);
  t.equal(parseBitcoinURL('bitcoin:123?amount=10'), null, 'should fail to parse BTC url');
  t.deepEqual(parseBitcoinURL('bitcoin:1Hgzt5xsnbfc8UTWqWKSTLRm5bEYHYBoCE?amount=10&message=test'), parsedBTCUrl, 'should parse BTC url');
  t.deepEqual(parseBitcoinURL('komodo:RRyBxbrAPRUBCUpiJgJZYrkxqrh8x5ta9Z?amount=10&message=test'), parsedKMDUrl, 'should parse KMD url');
});