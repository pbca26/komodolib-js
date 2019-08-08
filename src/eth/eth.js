const {
  formatEther,
  parseUnits,
} = require('ethers/utils/units');
const standardABI = require('./erc20-standard-abi');
const erc20ContractID = require('./eth-erc20-contract-id');
const erc20Decimals = require('./eth-erc20-decimals');

// normalize eth transactions to btc like list
const ethTransactionsToBtc = (transactions, address, isErc20, decimals) => {
  let _txs = [];

  if (transactions.length) {
    for (let i = 0; i < transactions.length; i++) {
      let type;

      if (transactions[i].from === transactions[i].to) {
        type = 'self';
      } else if (transactions[i].from === address.toLowerCase()) {
        type = 'sent';                    
      } else if (transactions[i].to === address.toLowerCase()) {
        type = 'received';                    
      }

      let _txObj = {
        type,
        height: transactions[i].blockNumber,
        timestamp: transactions[i].timeStamp,
        txid: transactions[i].hash,
        nonce: transactions[i].nonce,
        blockhash: transactions[i].blockHash,
        txindex: transactions[i].transactionIndex,
        src: transactions[i].from,
        address: transactions[i].to,
        amount: formatEther(transactions[i].value),
        amountWei: transactions[i].value,
        gas: formatEther(transactions[i].gas),
        gasWei: transactions[i].gas,
        gasPrice: formatEther(transactions[i].gasPrice),
        gasPriceWei: transactions[i].gasPrice,
        cumulativeGasUsed: formatEther(transactions[i].cumulativeGasUsed),
        cumulativeGasUsedWei: transactions[i].cumulativeGasUsed,
        gasUsed: formatEther(transactions[i].gasUsed),
        gasUsedWei: transactions[i].gasUsed,
        fee: formatEther(Number(transactions[i].gasPrice) * Number(transactions[i].gasUsed)),
        feeWei: Number(transactions[i].gasPrice) * Number(transactions[i].gasUsed),
        input: transactions[i].input,
        contractAddress: transactions[i].contractAddress,
        confirmations: transactions[i].confirmations,
      };

      if (isErc20) {
        _txObj.tokenName = transactions[i].tokenName;
        _txObj.tokenSymbol = transactions[i].tokenSymbol;
        _txObj.tokenDecimal = transactions[i].tokenDecimal;
        _txObj.amount = formatEther(parseUnits(transactions[i].value, decimals).toString());
        _txObj.amountWei = parseUnits(transactions[i].value, decimals).toString();
      } else {
        _txObj.error = transactions[i].isError;
        _txObj.txreceipt_status = transactions[i].txreceipt_status;
      }
      
      _txs.push(_txObj);
    }
  }

  let _uniqueTxs = new Array();
  _uniqueTxs = Array.from(new Set(_txs.map(JSON.stringify))).map(JSON.parse);

  return _uniqueTxs;
};

// http://gasstation.info/json/ethgasAPI.json rates are in 10gwei
const ethGasStationRateToWei = (rate) => {
  return parseUnits(Number(rate / 10).toString(), 'gwei').toString();
};

const maxSpend = (balance, fee, amount) => {
  let _amount = amount > balance ? balance : amount;

  if (Number(_amount) + fee > balance) {
    _amount -= fee;
  }

  return _amount;
}

module.exports = {
  ethTransactionsToBtc,
  ethGasStationRateToWei,
  maxSpend,
  standardABI,
  erc20ContractID,
  erc20Decimals,
};