const bitcoinJSForks = require('bitcoinforksjs-lib');
const bitcoinZcash = require('bitcoinjs-lib-zcash');
const bitcoinPos = require('bitcoinjs-lib-pos');
const bitcoin = require('bitcoinjs-lib');
const utils = require('./utils');
const coinselect = require('coinselect');

// single sig
const transaction = (sendTo, changeAddress, wif, network, utxo, changeValue, spendValue, opreturn) => {
  let key = network.isZcash ? bitcoinZcash.ECPair.fromWIF(wif, network) : bitcoin.ECPair.fromWIF(wif, network);
  let tx;
  let btcFork = {};

  if (network.isZcash) {
    tx = new bitcoinZcash.TransactionBuilder(network);
  } else if (network.isPoS) {
    tx = new bitcoinPos.TransactionBuilder(network);
  } else if (network.isBtcFork) {
    tx = new bitcoinJSForks.TransactionBuilder(network);
    const keyPair = bitcoinJSForks.ECPair.fromWIF(wif, network);
    btcFork = {
      keyPair,
      pk: bitcoinJSForks.crypto.hash160(keyPair.getPublicKeyBuffer()),
      spk: bitcoinJSForks.script.pubKeyHash.output.encode(bitcoinJSForks.crypto.hash160(keyPair.getPublicKeyBuffer())),
    };
  } else {
    tx = new bitcoin.TransactionBuilder(network);
  }

  for (let i = 0; i < utxo.length; i++) {
    if (network.isBtcFork) {
      tx.addInput(utxo[i].txid, utxo[i].vout, bitcoinJSForks.Transaction.DEFAULT_SEQUENCE, btcFork.spk);
    } else {
      tx.addInput(utxo[i].txid, utxo[i].vout);
    }
  }

  if (network.isPoS) {
    tx.addOutput(sendTo, Number(spendValue), network);
  } else {
    tx.addOutput(sendTo, Number(spendValue));
  }

  if (changeValue > 0) {
    if (network.isPoS) {
      tx.addOutput(changeAddress, Number(changeValue), network);
    } else {
      tx.addOutput(changeAddress, Number(changeValue));
    }
  }

  if (opreturn) {
    const data = Buffer.from(opreturn, 'utf8');
    const dataScript = bitcoin.script.nullData.output.encode(data);
    tx.addOutput(dataScript, 1000);
  }

  if (network.forkName &&
      network.forkName === 'btg') {
    tx.enableBitcoinGold(true);
    tx.setVersion(2);
  } else if (network.forkName && network.forkName === 'bch') {
    tx.enableBitcoinCash(true);
    tx.setVersion(2);
  }

  if (network.kmdInterest) {
    const _locktime = Math.floor(Date.now() / 1000) - 777;
    tx.setLockTime(_locktime);
  }

  for (let i = 0; i < utxo.length; i++) {
    if (network.isPoS) {
      tx.sign(network, i, key);
    } else if (network.isBtcFork) {
      const hashType = bitcoinJSForks.Transaction.SIGHASH_ALL | bitcoinJSForks.Transaction.SIGHASH_BITCOINCASHBIP143;
      tx.sign(i, btcFork.keyPair, null, hashType, utxo[i].value);
    } else {
      tx.sign(i, key);
    }
  }

  const rawtx = tx.build().toHex();

  return rawtx;
}

// TODO: merge sendmany
const data = (network, value, fee, outputAddress, changeAddress, utxoList) => {
  const btcFee = fee.perbyte ? fee.value : null; // TODO: coin non specific switch static/dynamic fee

  if (btcFee) {
    fee = 0;
  }

  if (utxoList &&
      utxoList.length &&
      utxoList[0] &&
      utxoList[0].txid) {
    let utxoListFormatted = [];
    let totalInterest = 0;
    let totalInterestUTXOCount = 0;
    let interestClaimThreshold = 200;
    let utxoVerified = true;

    for (let i = 0; i < utxoList.length; i++) {
      if (network.kmdInterest) {
        utxoListFormatted.push({
          txid: utxoList[i].txid,
          vout: utxoList[i].vout,
          value: Number(utxoList[i].amountSats),
          interestSats: Number(utxoList[i].interestSats),
          verified: utxoList[i].verified ? utxoList[i].verified : false,
        });
      } else {
        utxoListFormatted.push({
          txid: utxoList[i].txid,
          vout: utxoList[i].vout,
          value: Number(utxoList[i].amountSats),
          verified: utxoList[i].verified ? utxoList[i].verified : false,
        });
      }
    }

    const _maxSpendBalance = Number(utils.maxSpendBalance(utxoListFormatted));
    let targets = [{
      address: outputAddress,
      value: value > _maxSpendBalance ? _maxSpendBalance : value,
    }];

    targets[0].value = targets[0].value + fee;

    // default coin selection algo blackjack with fallback to accumulative
    // make a first run, calc approx tx fee
    // if ins and outs are empty reduce max spend by txfee
    const firstRun = coinselect(utxoListFormatted, targets, btcFee ? btcFee : 0);
    let inputs = firstRun.inputs;
    let outputs = firstRun.outputs;

    if (btcFee) {
      fee = firstRun.fee;
    }

    if (!outputs) {
      targets[0].value = targets[0].value - fee;

      const secondRun = coinselect(utxoListFormatted, targets, 0);
      inputs = secondRun.inputs;
      outputs = secondRun.outputs;
      fee = fee ? fee : secondRun.fee;
    }

    let _change = 0;

    if (outputs &&
        outputs.length === 2) {
      _change = outputs[1].value - fee;
    }

    if (!btcFee &&
        _change === 0) {
      outputs[0].value = outputs[0].value - fee;
    }

    if (btcFee) {
      value = outputs[0].value;
    } else {
      if (_change > 0) {
        value = outputs[0].value - fee;
      }
    }

    // check if any outputs are unverified
    if (inputs &&
        inputs.length) {
      for (let i = 0; i < inputs.length; i++) {
        if (!inputs[i].verified) {
          utxoVerified = false;
          break;
        }
      }

      for (let i = 0; i < inputs.length; i++) {
        if (Number(inputs[i].interestSats) > interestClaimThreshold) {
          totalInterest += Number(inputs[i].interestSats);
          totalInterestUTXOCount++;
        }
      }
    }

    const _maxSpend = utils.maxSpendBalance(utxoListFormatted);

    if (value > _maxSpend) {
      return `Spend value is too large. Max available amount is ${Number(((_maxSpend * 0.00000001).toFixed(8)))}`;
    } else {
      // account for KMD interest
      if (network.kmdInterest &&
          totalInterest > 0) {
        // account for extra vout

        if ((_maxSpend - fee) === value) {
          _change = totalInterest - _change;

          if (outputAddress === changeAddress) {
            value += _change;
            _change = 0;
          }
        } else {
          _change += totalInterest;
        }

        // double check kmd interest is combined into 1 output
        if (outputAddress === changeAddress &&
            _change > 0) {
          value += _change - fee;
          _change = 0;
        }
      }

      if (!inputs &&
          !outputs) {
        return 'Can\'t find best fit utxo. Try lower amount.';
      } else {
        let vinSum = 0;

        for (let i = 0; i < inputs.length; i++) {
          vinSum += inputs[i].value;
        }

        const _estimatedFee = vinSum - outputs[0].value - _change;

        // double check no extra fee is applied
        if ((vinSum - value - _change) > fee) {
          _change += fee;
        } else if ((vinSum - value - _change) === 0) { // max amount spend edge case
          value = value - fee;
        }

        // TODO: use individual dust thresholds
        if (_change > 0 &&
            _change <= 1000) {
          _change = 0;
        }

        return {
          outputAddress,
          changeAddress,
          network,
          change: _change,
          value,
          inputs,
          outputs,
          targets,
          fee,
          estimatedFee: _estimatedFee,
          balance: _maxSpendBalance,
          totalInterest,
          utxoVerified,
        };
      }
    }
  } else {
    return 'no valid utxos';
  }
};

module.exports = {
  data,
  transaction,
};