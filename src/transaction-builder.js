const bitcoinJSForks = require('bitcoinforksjs-lib');
const bitcoinZcash = require('bitcoinjs-lib-zcash');
const bitcoinPos = require('bitcoinjs-lib-pos');
const bitcoinZcashSapling = require('bitgo-utxo-lib');
const bitcoin = require('bitcoinjs-lib');
const coinselect = require('coinselect');
const utils = require('./utils');

// current multisig limitations: no PoS, no btc forks
const transaction = (sendTo, changeAddress, wif, network, utxo, changeValue, spendValue, options) => {
  const key = network.isZcash ? bitcoinZcash.ECPair.fromWIF(wif, network) : bitcoin.ECPair.fromWIF(wif, network);
  let tx;
  let btcFork = {};

  if (network.isZcash &&
      !network.sapling) {
    tx = new bitcoinZcash.TransactionBuilder(network);
  } else if (
    network.isZcash &&
    network.sapling &&
    ((network.saplingActivationTimestamp && Math.floor(Date.now() / 1000) > network.saplingActivationTimestamp) ||
    (network.saplingActivationHeight && utxo[0].currentHeight > network.saplingActivationHeight))
  ) {    
    tx = !options || (options && !options.multisig) || (options && options.multisig && options.multisig.creator) ? new bitcoinZcashSapling.TransactionBuilder(network) : new bitcoinZcashSapling.TransactionBuilder.fromTransaction(bitcoinZcashSapling.Transaction.fromHex(options.multisig.rawtx, network), network);
  } else if (network.isPoS) {
    // TODO
    tx = new bitcoinPos.TransactionBuilder(network);
  } else if (network.isBtcFork) {
    // TODO
    tx = new bitcoinJSForks.TransactionBuilder(network);
    const keyPair = bitcoinJSForks.ECPair.fromWIF(wif, network);
    btcFork = {
      keyPair,
      pk: bitcoinJSForks.crypto.hash160(keyPair.getPublicKeyBuffer()),
      spk: bitcoinJSForks.script.pubKeyHash.output.encode(bitcoinJSForks.crypto.hash160(keyPair.getPublicKeyBuffer())),
    };
  } else {
    tx = !options || (options && !options.multisig) || (options && options.multisig && options.multisig.creator) ? new bitcoin.TransactionBuilder(network) : new bitcoin.TransactionBuilder.fromTransaction(bitcoin.Transaction.fromHex(options.multisig.rawtx, network), network);
  }

  for (let i = 0; i < utxo.length; i++) {
    if (network.isBtcFork) {
      tx.addInput(utxo[i].txid, utxo[i].vout, bitcoinJSForks.Transaction.DEFAULT_SEQUENCE, btcFork.spk);
    } else {
      if (options &&
          options.multisig &&
          options.multisig.creator) {
        tx.addInput(utxo[i].txid, utxo[i].vout, 0, null, new Buffer.from(options.multisig.scriptPubKey, 'hex'));
      }

      if (!options ||
          (options && !options.multisig)) {
        tx.addInput(utxo[i].txid, utxo[i].vout);
      }
    }
  }

  if (!options ||
      (options && !options.multisig) ||
      (options && options.multisig && options.multisig.creator)) {
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

    if (options &&
        options.opreturn) {
      const data = Buffer.from(opreturn, 'utf8');
      const dataScript = bitcoin.script.nullData.output.encode(data);
      
      tx.addOutput(dataScript, 1000);
    }

    if (network.forkName &&
        network.forkName === 'btg') {
      tx.enableBitcoinGold(true);
      tx.setVersion(2);
    } else if (
      network.forkName &&
      network.forkName === 'bch'
    ) {
      tx.enableBitcoinCash(true);
      tx.setVersion(2);
    } else if (network.sapling) {
      let versionNum;

      if ((network.saplingActivationHeight && utxo[0].currentHeight >= network.saplingActivationHeight) ||
          (network.saplingActivationTimestamp && Math.floor(Date.now() / 1000) > network.saplingActivationTimestamp)) {
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

  if (!options ||
      (options && !options.unsigned)) {
    for (let i = 0; i < utxo.length; i++) {
      if (network.isPoS) {
        tx.sign(network, i, key);
      } else if (network.isBtcFork) {
        const hashType = bitcoinJSForks.Transaction.SIGHASH_ALL | bitcoinJSForks.Transaction.SIGHASH_BITCOINCASHBIP143;
        tx.sign(i, btcFork.keyPair, null, hashType, utxo[i].value);
      } else if (
        (network.sapling && network.saplingActivationTimestamp && Math.floor(Date.now() / 1000) > network.saplingActivationTimestamp) ||
        (network.sapling && network.saplingActivationHeight && utxo[0].currentHeight >= network.saplingActivationHeight)) {
        if (options &&
            options.multisig) {
          tx.sign(i, key, new Buffer.from(options.multisig.redeemScript, 'hex'), null, utxo[i].value);
        } else {
          tx.sign(i, key, '', null, utxo[i].value);
        }
      } else {
        tx.sign(i, key);
      }
    }

    if (options &&
        options.multisig &&
        options.multisig.incomplete) {
      return tx.buildIncomplete().toHex();
    } else {
      return tx.build().toHex();
    }
  } else {
    return tx.buildIncomplete().toHex();
  }
};

// TODO: merge sendmany
const data = (network, value, fee, outputAddress, changeAddress, utxoList) => {
  const btcFee = fee.perbyte ? fee.value : null; // TODO: coin non specific switch static/dynamic fee
  const inputValue = value;

  if (btcFee) {
    fee = 0;
  }

  if (utxoList &&
      utxoList.length &&
      utxoList[0] &&
      utxoList[0].txid) {
    const utxoListFormatted = [];
    let totalInterest = 0;
    let totalInterestUTXOCount = 0;
    const interestClaimThreshold = 200;
    let utxoVerified = true;

    for (let i = 0; i < utxoList.length; i++) {
      let _utxo = {
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
      return `Spend value is too large. Max available amount is ${Number(((_maxSpendBalance * 0.00000001).toFixed(8)))}`;
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
      fee = fee || secondRun.fee;
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
    } else if (_change >= 0) {
      value = outputs[0].value - fee;
    }
    
    if (outputs[0].value === value + fee) {
      outputs[0].value === outputs[0].value - fee;
      targets[0].value = targets[0].value - fee;
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

    // account for KMD interest
    if (network.kmdInterest &&
        totalInterest > 0) {
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
      if (outputAddress === changeAddress &&
          _change > 0) {
        value += _change - fee;

        if (Math.abs(value - inputValue) > fee) {
          value += fee;
        }

        _change = 0;
      }
    }

    if (!inputs &&
        !outputs) {
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