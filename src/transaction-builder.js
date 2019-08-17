const bitcoin = require('bitgo-utxo-lib');
const coinselect = require('coinselect');
const utils = require('./utils');


// TODO: eth wrapper

// current multisig limitations: no PoS, no btc forks
const transaction = (sendTo, changeAddress, wif, network, utxo, changeValue, spendValue, options) => {
  const key = bitcoin.ECPair.fromWIF(wif, network);
  const tx = !options || (options && !options.multisig) || (options && options.multisig && options.multisig.creator)
    ? new bitcoin.TransactionBuilder(network)
    : bitcoin.TransactionBuilder.fromTransaction(
      bitcoin.Transaction.fromHex(options.multisig.rawtx, network), network
    );

  for (let i = 0; i < utxo.length; i++) {
    if (options
      && options.multisig
      && options.multisig.creator) {
      tx.addInput(utxo[i].txid, utxo[i].vout, 0, null, Buffer.from(options.multisig.scriptPubKey, 'hex'));
    }

    if (!options
      || (options && !options.multisig)) {
      tx.addInput(utxo[i].txid, utxo[i].vout);
    }
  }

  if (!options
    || (options && !options.multisig)
    || (options && options.multisig && options.multisig.creator)) {
    tx.addOutput(sendTo, Number(spendValue));

    if (changeValue > 0) {
      tx.addOutput(changeAddress, Number(changeValue));
    }

    if (options
      && options.opreturn) {
      const data = Buffer.from(options.opreturn, 'utf8');
      const dataScript = bitcoin.script.nullData.output.encode(data);

      tx.addOutput(dataScript, 1000);
    }

    if (network.sapling) {
      let versionNum;

      if ((network.saplingActivationHeight && utxo[0].currentHeight >= network.saplingActivationHeight)
        || (network.saplingActivationTimestamp && Math.floor(Date.now() / 1000) > network.saplingActivationTimestamp)) {
        versionNum = 4;
      } else {
        versionNum = 1;
      }

      if (versionNum) {
        tx.setVersion(versionNum);
      }
    }

    if (network.kmdInterest) {
      const _locktime = Math.floor(Date.now() / 1000) - 777;
      tx.setLockTime(_locktime);
    }
  }

  if (!options
    || (options && !options.unsigned)) {
    for (let i = 0; i < utxo.length; i++) {
      if (bitcoin.coins.isBitcoinCash(network) || bitcoin.coins.isBitcoinGold(network) || bitcoin.coins.isBitcoinSV(network)) {
        const hashType = bitcoin.Transaction.SIGHASH_ALL | bitcoin.Transaction.SIGHASH_BITCOINCASHBIP143;
        tx.sign(i, key, null, hashType, utxo[i].value);
      } else if (
        (network.sapling && network.saplingActivationTimestamp && Math.floor(Date.now() / 1000) > network.saplingActivationTimestamp)
        || (network.sapling && network.saplingActivationHeight && utxo[0].currentHeight >= network.saplingActivationHeight)) {
        if (options
          && options.multisig) {
          tx.sign(i, key, Buffer.from(options.multisig.redeemScript, 'hex'), null, utxo[i].value);
        } else {
          tx.sign(i, key, '', null, utxo[i].value);
        }
      } else {
        tx.sign(i, key);
      }
    }

    if (options
      && options.multisig
      && options.multisig.incomplete) {
      return tx.buildIncomplete().toHex();
    }
    return tx.build().toHex();
  }
  return tx.buildIncomplete().toHex();
};

// TODO: merge sendmany
const data = (network, value, fee, outputAddress, changeAddress, utxoList) => {
  const btcFee = fee.perbyte ? fee.value : null; // TODO: coin non specific switch static/dynamic fee
  const inputValue = value;

  if (btcFee) {
    fee = 0;
  }

  if (utxoList
    && utxoList.length
    && utxoList[0]
    && utxoList[0].txid) {
    const utxoListFormatted = [];
    const interestClaimThreshold = 200;
    let totalInterest = 0;
    let totalInterestUTXOCount = 0;
    let utxoVerified = true;

    for (let i = 0; i < utxoList.length; i++) {
      const _utxo = {
        txid: utxoList[i].txid,
        vout: utxoList[i].vout,
        value: Number(utxoList[i].amountSats || utxoList[i].value),
        verified: utxoList[i].verified ? utxoList[i].verified : false,
      };

      if (network.kmdInterest) {
        _utxo.interestSats = Number(utxoList[i].interestSats || utxoList[i].interest || 0);
      }

      if (utxoList[i].hasOwnProperty('dpowSecured')) {
        _utxo.dpowSecured = utxoList[i].dpowSecured;
      }

      if (utxoList[i].hasOwnProperty('currentHeight')) {
        _utxo.currentHeight = utxoList[i].currentHeight;
      }

      utxoListFormatted.push(_utxo);
    }

    const _maxSpendBalance = Number(utils.maxSpendBalance(utxoListFormatted));

    if (value > _maxSpendBalance) {
      return `Spend value is too large or unconfirmed UTXO(S). Max available amount is ${Number(((_maxSpendBalance * 0.00000001).toFixed(8)))}`;
    }

    const targets = [{
      address: outputAddress,
      value: value > _maxSpendBalance ? _maxSpendBalance : value,
    }];

    targets[0].value = targets[0].value + fee;

    // default coin selection algo blackjack with fallback to accumulative
    // make a first run, calc approx tx fee
    // if ins and outs are empty reduce max spend by txfee
    const firstRun = coinselect(utxoListFormatted, targets, btcFee || 0);
    let { inputs } = firstRun;
    let { outputs } = firstRun;

    if (btcFee) {
      fee = firstRun.fee;
    }

    if (!outputs) {
      targets[0].value = targets[0].value - fee;

      const secondRun = coinselect(utxoListFormatted, targets, 0);
      inputs = secondRun.inputs;
      outputs = secondRun.outputs;
      fee = fee || secondRun.fee;
    }

    let _change = 0;

    if (outputs
      && outputs.length === 2) {
      _change = outputs[1].value - fee;
    }

    if (!btcFee
      && _change === 0) {
      outputs[0].value = outputs[0].value - fee;
    }

    if (btcFee) {
      value = outputs[0].value;
    } else if (_change >= 0) {
      value = outputs[0].value - fee;
    }

    if (outputs[0].value === value + fee) {
      outputs[0].value = outputs[0].value - fee;
      targets[0].value = targets[0].value - fee;
    }

    // check if any outputs are unverified
    if (inputs
      && inputs.length) {
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

    // account for KMD interest
    if (network.kmdInterest
      && totalInterest > 0) {
      // account for extra vout

      if ((_maxSpendBalance - fee) === value) {
        _change = totalInterest - _change;

        if (outputAddress === changeAddress) {
          value += _change;
          _change = 0;
        }
      } else {
        _change += totalInterest;
      }

      // double check kmd interest is combined into 1 output
      if (outputAddress === changeAddress
        && _change > 0) {
        value += _change - fee;

        if (Math.abs(value - inputValue) > fee) {
          value += fee;
        }

        _change = 0;
      }
    }

    if (!inputs
      && !outputs) {
      return 'Can\'t find best fit utxo. Try lower amount.';
    }

    let vinSum = 0;

    for (let i = 0; i < inputs.length; i++) {
      vinSum += inputs[i].value;
    }

    let voutSum = 0;

    for (let i = 0; i < outputs.length; i++) {
      voutSum += outputs[i].value;
    }

    const _estimatedFee = vinSum - voutSum - totalInterest;

    // double check no extra fee is applied
    if ((vinSum - value - _change) > fee) {
      _change += fee;
    } else if ((vinSum - value - _change) === 0) { // max amount spend edge case
      value -= fee;
    }

    // TODO: use individual dust thresholds
    if (_change > 0
      && _change <= 1000) {
      _change = 0;
    }

    return {
      outputAddress,
      changeAddress,
      network,
      change: _change,
      value,
      inputValue,
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

  return 'no valid utxos';
};

module.exports = {
  data,
  transaction,
};
