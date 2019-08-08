const erc20ContractId = require('./eth-erc20-contract-id');

// non-standard token decimals only
// default is 18
const _decimals = {
  BIO: 8,
  BITSOKO: 8,
  BTCL: 8,
  CS: 6,
  ENG: 8,
  ETK: 2,
  FOOD: 8,
  GTO: 5,
  ITL: 8,
  KICK: 8,
  LTR: 8,
  LYS: 8,
  MRPH: 4,
  PCL: 8,
  PURC: 8,
  QBIT: 6,
  SUB: 2,
  TRAT: 5,
  DCN: 0,
  DRT: 8,
  RLTY: 8,
  PXT: 8,
  WAX: 8,
  USDT: 6,
  BBT: 4,
  R: 0,
  UCASH: 8,
  DGD: 9,
  HYD: 12,
  PPT: 8,
  YLC: 8,
  ETHOS: 8,
  QASH: 6,
  FUN: 8,
  SALT: 8,
  STORJ: 8,
  RLC: 9,
  CVC: 8,
  MCO: 8,
  MGO: 8,
  MTL: 8,
  EDG: 0,
  POWR: 6,
  RHOC: 8,
  SNGLS: 0,
  TAAS: 6,
  ADT: 9,
  AST: 4,
  TKN: 8,
  HMQ: 8,
  BCAP: 0,
  TRST: 6,
  GUP: 3,
  TIME: 8,
  DICE: 16,
  XAUR: 8,
  HGT: 8,
  ZIL: 12,
  KEA: 8,
  OVAL: 8,
  TRET: 8,
  DEC8: 8,
};

let decimals = {};

for (let key in erc20ContractId) {
  if (_decimals[key] === 0) {
    decimals[key] = 0;
  } else {
    decimals[key] = _decimals[key] || 18;
  }
}

module.exports = decimals;