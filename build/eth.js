'use strict';

var ethers = require('ethers');

// normalize eth transactions to btc like list
var ethTransactionsToBtc = function ethTransactionsToBtc(transactions) {
  if (transactions.length) {
    for (var i = 0; i < transactions.length; i++) {
      var type = void 0;

      if (transactions[i].from === transactions[i].to) {
        type = 'self';
      } else if (transactions[i].from === address.toLowerCase()) {
        type = 'sent';
      } else if (transactions[i].to === address.toLowerCase()) {
        type = 'received';
      }

      _txs.push({
        type: type,
        height: transactions[i].blockNumber,
        timestamp: transactions[i].timeStamp,
        txid: transactions[i].hash,
        nonce: transactions[i].nonce,
        blockhash: transactions[i].blockHash,
        txindex: transactions[i].transactionIndex,
        src: transactions[i].from,
        address: transactions[i].to,
        amount: ethers.utils.formatEther(transactions[i].value),
        amountWei: transactions[i].value,
        gas: ethers.utils.formatEther(transactions[i].gas),
        gasWei: transactions[i].gas,
        gasPrice: ethers.utils.formatEther(transactions[i].gasPrice),
        gasPriceWei: transactions[i].gasPrice,
        cumulativeGasUsed: ethers.utils.formatEther(transactions[i].cumulativeGasUsed),
        cumulativeGasUsedWei: transactions[i].cumulativeGasUsed,
        gasUsed: ethers.utils.formatEther(transactions[i].gasUsed),
        gasUsedWei: transactions[i].gasUsed,
        fee: ethers.utils.formatEther(Number(transactions[i].gasPrice) * Number(transactions[i].gasUsed)),
        feeWei: Number(transactions[i].gasPrice) * Number(transactions[i].gasUsed),
        error: transactions[i].isError,
        txreceipt_status: transactions[i].txreceipt_status,
        input: transactions[i].input,
        contractAddress: transactions[i].contractAddress,
        confirmations: transactions[i].confirmations
      });
    }
  }

  var _uniqueTxs = new Array();
  _uniqueTxs = Array.from(new Set(_txs.map(JSON.stringify))).map(JSON.parse);

  return _uniqueTxs;
};

// http://gasstation.info/json/ethgasAPI.json rates are in 10gwei
var ethGasStationRateToWei = function ethGasStationRateToWei(rate) {
  return Number(rate) / 10 * 1000000000;
};

var maxSpend = function maxSpend(balance, fee, amount) {
  var _amount = amount > balance ? balance : amount;

  if (Number(_amount) + fee > balance) {
    _amount -= fee;
  }

  return _amount;
};

module.exports = {
  ethTransactionsToBtc: ethTransactionsToBtc
};