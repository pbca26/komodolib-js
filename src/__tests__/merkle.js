// https://github.com/request/request/tree/master/tests

import test from 'tape';
import fs from 'fs';

const getMerkleRoot = require('../transaction-merkle');
const network = require('../bitcoinjs-networks');
const fixture = JSON.parse(fs.readFileSync(__dirname + '/fixtures/merkle.json'));

test('src - getMerkleRoot - KMD', async (t) => {
  const root = getMerkleRoot(
    'f83ca2df471975efbb5561a161494c9a2d78583a06ae275eadc677a07021f745',
    fixture.KMD.merkleInfo.merkle,
    fixture.KMD.merkleInfo.pos
  );
  
  t.plan(1);
  t.equal(root, fixture.KMD.block.merkleRoot, 'calculated merkle root should be equal to a1af82f5028082e7eb21e2adeab95745afd63ef91cedca70bbf79d711516cb89');
});

test('src - getMerkleRoot - BTC', async (t) => {
  const root = getMerkleRoot(
    'adcd254f8be517b1d1e035aea240fb21bfa0cc88a01f98d01e0535d7ffcb0372',
    fixture.BTC.merkleInfo.merkle,
    fixture.BTC.merkleInfo.pos
  );

  t.plan(1);
  t.equal(root, fixture.BTC.block.merkleRoot, 'calculated merkle root should be equal to 8b6fe2e983b5278b41574353bd2e8c13510fd02087eb5519158de903ebd978ab');
});