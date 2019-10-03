// https://github.com/request/request/tree/master/tests

import test from 'tape';
import fs from 'fs';

const {
  parseBlock,
  parseBlockToJSON,
  electrumMerkleRoot,
} = require('../block');
const network = require('../bitcoinjs-networks');
const fixture = JSON.parse(fs.readFileSync(__dirname + '/fixtures/block.json'));

test('src - block - parseBlock - KMD', async (t) => {
  const block = parseBlock(fixture.KMD, network.kmd);
  
  t.plan(7);
  t.equal(typeof block === 'object', true, 'should return parsed KMD block object');
  t.equal(block.version, 4, 'block version = 4');
  t.equal(block.timestamp, 1473793441, 'block timestamp = 1473793441');
  t.equal(block.bits, 537857807, 'block bits = 537857807');
  t.equal(block.solutionSize, 1344, 'block solutionSize = 1344');
  t.equal(block.prevHash.toString('hex'), '71aeaa7dfb5c6cf5977832aebea1bf630a6d482b464610aa125ba6c358377e02', 'block prevHash = 71aeaa7dfb5c6cf5977832aebea1bf630a6d482b464610aa125ba6c358377e02');
  t.equal(block.merkleRoot.toString('hex'), '2a91aecbaba2dcbe495c56fc8a68491bc47da9eb94a37f491514fbb70f0517e4', 'block merkleRoot = 2a91aecbaba2dcbe495c56fc8a68491bc47da9eb94a37f491514fbb70f0517e4');
});

test('src - block - parseBlock - BTC', async (t) => {
  const block = parseBlock(fixture.BTC, network.btc);
  
  t.plan(7);
  t.equal(typeof block === 'object', true, 'should return parsed BTC block object');
  t.equal(block.version, 1, 'block version = 1');
  t.equal(block.timestamp, 1231469665, 'block timestamp = 1231469665');
  t.equal(block.bits, 486604799, 'block bits = 486604799');
  t.equal(block.nonce, 2573394689, 'block nonce = 2573394689');
  t.equal(block.prevHash.toString('hex'), '6fe28c0ab6f1b372c1a6a246ae63f74f931e8365e15a089c68d6190000000000', 'block prevHash = 6fe28c0ab6f1b372c1a6a246ae63f74f931e8365e15a089c68d6190000000000');
  t.equal(block.merkleRoot.toString('hex'), '982051fd1e4ba744bbbe680e1fee14677ba1a3c3540bf7b1cdb606e857233e0e', 'block merkleRoot = 982051fd1e4ba744bbbe680e1fee14677ba1a3c3540bf7b1cdb606e857233e0e');
});

test('src - block - parseBlockToJSON - BTC', async (t) => {
  const block = parseBlockToJSON(fixture.BTC, network.btc);
  
  t.plan(7);
  t.equal(typeof block === 'object', true, 'should return parsed BTC block object');
  t.equal(block.version, 1, 'block version = 1');
  t.equal(block.timestamp, 1231469665, 'block timestamp = 1231469665');
  t.equal(block.bits, 486604799, 'block bits = 486604799');
  t.equal(block.nonce, 2573394689, 'block nonce = 2573394689');
  t.equal(block.prevHash, '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f', 'block prevHash = 000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f');
  t.equal(block.merkleRoot, '0e3e2357e806b6cdb1f70b54c3a3a17b6714ee1f0e68bebb44a74b1efd512098', 'block merkleRoot = 0e3e2357e806b6cdb1f70b54c3a3a17b6714ee1f0e68bebb44a74b1efd512098');
});

test('src - block - parseBlockToJSON - KMD', async (t) => {
  const block = parseBlockToJSON(fixture.KMD, network.kmd);
  
  t.plan(7);
  t.equal(typeof block === 'object', true, 'should return parsed KMD block object');
  t.equal(block.version, 4, 'block version = 4');
  t.equal(block.timestamp, 1473793441, 'block timestamp = 1473793441');
  t.equal(block.bits, 537857807, 'block bits = 537857807');
  t.equal(block.solutionSize, 1344, 'block solutionSize = 1344');
  t.equal(block.prevHash, '027e3758c3a65b12aa1046462b486d0a63bfa1beae327897f56c5cfb7daaae71', 'block prevHash = 027e3758c3a65b12aa1046462b486d0a63bfa1beae327897f56c5cfb7daaae71');
  t.equal(block.merkleRoot, 'e417050fb7fb1415497fa394eba97dc41b49688afc565c49bedca2abcbae912a', 'block merkleRoot = e417050fb7fb1415497fa394eba97dc41b49688afc565c49bedca2abcbae912a');
});

test('src - block - electrumMerkleRoot - KMD', async (t) => {
  const block = parseBlock(fixture.KMD, network.kmd);
  const merkleRoot = electrumMerkleRoot(block);
  
  t.plan(1);
  t.equal(merkleRoot, 'e417050fb7fb1415497fa394eba97dc41b49688afc565c49bedca2abcbae912a', 'block merkleRoot = e417050fb7fb1415497fa394eba97dc41b49688afc565c49bedca2abcbae912a');
});

test('src - block - electrumMerkleRoot - BTC', async (t) => {
  const block = parseBlock(fixture.BTC, network.btc);
  const merkleRoot = electrumMerkleRoot(block);
  
  t.plan(1);
  t.equal(merkleRoot, '0e3e2357e806b6cdb1f70b54c3a3a17b6714ee1f0e68bebb44a74b1efd512098', 'block merkleRoot = 0e3e2357e806b6cdb1f70b54c3a3a17b6714ee1f0e68bebb44a74b1efd512098');
});