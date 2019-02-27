'use strict';

var bitcoinJSForks = require('bitcoinforksjs-lib');
var bitcoinZcash = require('bitcoinjs-lib-zcash');
var bitcoinPos = require('bitcoinjs-lib-pos');
var bitcoinZcashSapling = require('bitgo-utxo-lib');
var bitcoin = require('bitcoinjs-lib');
var coinselect = require('coinselect');
var utils = require('./utils');

// current multisig limitations: no PoS, no btc forks
var transaction = function transaction(sendTo, changeAddress, wif, network, utxo, changeValue, spendValue, options) {
  var key = network.isZcash ? bitcoinZcash.ECPair.fromWIF(wif, network) : bitcoin.ECPair.fromWIF(wif, network);
  var tx = void 0;
  var btcFork = {};

  if (network.isZcash && !network.sapling) {
    tx = new bitcoinZcash.TransactionBuilder(network);
  } else if (network.isZcash && network.sapling && (network.saplingActivationTimestamp && Math.floor(Date.now() / 1000) > network.saplingActivationTimestamp || network.saplingActivationHeight && utxo[0].currentHeight > network.saplingActivationHeight)) {
    tx = !options || options && !options.multisig || options && options.multisig && options.multisig.creator ? new bitcoinZcashSapling.TransactionBuilder(network) : new bitcoinZcashSapling.TransactionBuilder.fromTransaction(bitcoinZcashSapling.Transaction.fromHex(options.multisig.rawtx, network), network);
  } else if (network.isPoS) {
    // TODO
    tx = new bitcoinPos.TransactionBuilder(network);
  } else if (network.isBtcFork) {
    // TODO
    tx = new bitcoinJSForks.TransactionBuilder(network);
    var keyPair = bitcoinJSForks.ECPair.fromWIF(wif, network);
    btcFork = {
      keyPair: keyPair,
      pk: bitcoinJSForks.crypto.hash160(keyPair.getPublicKeyBuffer()),
      spk: bitcoinJSForks.script.pubKeyHash.output.encode(bitcoinJSForks.crypto.hash160(keyPair.getPublicKeyBuffer()))
    };
  } else {
    tx = !options || options && !options.multisig || options && options.multisig && options.multisig.creator ? new bitcoin.TransactionBuilder(network) : new bitcoin.TransactionBuilder.fromTransaction(bitcoin.Transaction.fromHex(options.multisig.rawtx, network), network);
  }

  for (var i = 0; i < utxo.length; i++) {
    if (network.isBtcFork) {
      tx.addInput(utxo[i].txid, utxo[i].vout, bitcoinJSForks.Transaction.DEFAULT_SEQUENCE, btcFork.spk);
    } else {
      if (options && options.multisig && options.multisig.creator) {
        tx.addInput(utxo[i].txid, utxo[i].vout, 0, null, new Buffer.from(options.multisig.scriptPubKey, 'hex'));
      }

      if (!options || options && !options.multisig) {
        tx.addInput(utxo[i].txid, utxo[i].vout);
      }
    }
  }

  if (!options || options && !options.multisig || options && options.multisig && options.multisig.creator) {
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

    if (options && options.opreturn) {
      var _data = Buffer.from(opreturn, 'utf8');
      var dataScript = bitcoin.script.nullData.output.encode(_data);

      tx.addOutput(dataScript, 1000);
    }

    if (network.forkName && network.forkName === 'btg') {
      tx.enableBitcoinGold(true);
      tx.setVersion(2);
    } else if (network.forkName && network.forkName === 'bch') {
      tx.enableBitcoinCash(true);
      tx.setVersion(2);
    } else if (network.sapling) {
      var versionNum = void 0;

      if (network.saplingActivationHeight && utxo[0].currentHeight >= network.saplingActivationHeight || network.saplingActivationTimestamp && Math.floor(Date.now() / 1000) > network.saplingActivationTimestamp) {
        versionNum = 4;
      } else {
        versionNum = 1;
      }

      if (versionNum) {
        tx.setVersion(versionNum);
      }
    }

    if (network.kmdInterest) {
      var _locktime = Math.floor(Date.now() / 1000) - 777;
      tx.setLockTime(_locktime);
    }
  }

  if (!options || options && !options.unsigned) {
    for (var _i = 0; _i < utxo.length; _i++) {
      if (network.isPoS) {
        tx.sign(network, _i, key);
      } else if (network.isBtcFork) {
        var hashType = bitcoinJSForks.Transaction.SIGHASH_ALL | bitcoinJSForks.Transaction.SIGHASH_BITCOINCASHBIP143;
        tx.sign(_i, btcFork.keyPair, null, hashType, utxo[_i].value);
      } else if (network.sapling && network.saplingActivationTimestamp && Math.floor(Date.now() / 1000) > network.saplingActivationTimestamp || network.sapling && network.saplingActivationHeight && utxo[0].currentHeight >= network.saplingActivationHeight) {
        if (options && options.multisig) {
          tx.sign(_i, key, new Buffer.from(options.multisig.redeemScript, 'hex'), null, utxo[_i].value);
        } else {
          tx.sign(_i, key, '', null, utxo[_i].value);
        }
      } else {
        tx.sign(_i, key);
      }
    }

    if (options && options.multisig && options.multisig.incomplete) {
      return tx.buildIncomplete().toHex();
    } else {
      return tx.build().toHex();
    }
  } else {
    return tx.buildIncomplete().toHex();
  }
};

// TODO: merge sendmany
var data = function data(network, value, fee, outputAddress, changeAddress, utxoList) {
  var btcFee = fee.perbyte ? fee.value : null; // TODO: coin non specific switch static/dynamic fee
  var inputValue = value;

  if (btcFee) {
    fee = 0;
  }

  if (utxoList && utxoList.length && utxoList[0] && utxoList[0].txid) {
    var utxoListFormatted = [];
    var totalInterest = 0;
    var totalInterestUTXOCount = 0;
    var interestClaimThreshold = 200;
    var utxoVerified = true;

    for (var i = 0; i < utxoList.length; i++) {
      var _utxo = {
        txid: utxoList[i].txid,
        vout: utxoList[i].vout,
        value: Number(utxoList[i].amountSats || utxoList[i].value),
        verified: utxoList[i].verified ? utxoList[i].verified : false
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

    var _maxSpendBalance = Number(utils.maxSpendBalance(utxoListFormatted));

    if (value > _maxSpendBalance) {
      return 'Spend value is too large. Max available amount is ' + Number((_maxSpendBalance * 0.00000001).toFixed(8));
    }

    var targets = [{
      address: outputAddress,
      value: value > _maxSpendBalance ? _maxSpendBalance : value
    }];

    targets[0].value = targets[0].value + fee;

    // default coin selection algo blackjack with fallback to accumulative
    // make a first run, calc approx tx fee
    // if ins and outs are empty reduce max spend by txfee
    var firstRun = coinselect(utxoListFormatted, targets, btcFee || 0);
    var inputs = firstRun.inputs;
    var outputs = firstRun.outputs;

    if (btcFee) {
      fee = firstRun.fee;
    }

    if (!outputs) {
      targets[0].value = targets[0].value - fee;

      var secondRun = coinselect(utxoListFormatted, targets, 0);
      inputs = secondRun.inputs;
      outputs = secondRun.outputs;
      fee = fee || secondRun.fee;
    }

    var _change = 0;

    if (outputs && outputs.length === 2) {
      _change = outputs[1].value - fee;
    }

    if (!btcFee && _change === 0) {
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
    if (inputs && inputs.length) {
      for (var _i2 = 0; _i2 < inputs.length; _i2++) {
        if (!inputs[_i2].verified) {
          utxoVerified = false;
          break;
        }
      }

      for (var _i3 = 0; _i3 < inputs.length; _i3++) {
        if (Number(inputs[_i3].interestSats) > interestClaimThreshold) {
          totalInterest += Number(inputs[_i3].interestSats);
          totalInterestUTXOCount++;
        }
      }
    }

    // account for KMD interest
    if (network.kmdInterest && totalInterest > 0) {
      // account for extra vout

      if (_maxSpendBalance - fee === value) {
        _change = totalInterest - _change;

        if (outputAddress === changeAddress) {
          value += _change;
          _change = 0;
        }
      } else {
        _change += totalInterest;
      }

      // double check kmd interest is combined into 1 output
      if (outputAddress === changeAddress && _change > 0) {
        value += _change - fee;

        if (Math.abs(value - inputValue) > fee) {
          value += fee;
        }

        _change = 0;
      }
    }

    if (!inputs && !outputs) {
      return 'Can\'t find best fit utxo. Try lower amount.';
    }
    var vinSum = 0;

    for (var _i4 = 0; _i4 < inputs.length; _i4++) {
      vinSum += inputs[_i4].value;
    }

    var voutSum = 0;

    for (var _i5 = 0; _i5 < outputs.length; _i5++) {
      voutSum += outputs[_i5].value;
    }

    var _estimatedFee = vinSum - voutSum - totalInterest;

    // double check no extra fee is applied
    if (vinSum - value - _change > fee) {
      _change += fee;
    } else if (vinSum - value - _change === 0) {
      // max amount spend edge case
      value -= fee;
    }

    // TODO: use individual dust thresholds
    if (_change > 0 && _change <= 1000) {
      _change = 0;
    }

    return {
      outputAddress: outputAddress,
      changeAddress: changeAddress,
      network: network,
      change: _change,
      value: value,
      inputValue: inputValue,
      inputs: inputs,
      outputs: outputs,
      targets: targets,
      fee: fee,
      estimatedFee: _estimatedFee,
      balance: _maxSpendBalance,
      totalInterest: totalInterest,
      utxoVerified: utxoVerified
    };
  }

  return 'no valid utxos';
};

module.exports = {
  data: data,
  transaction: transaction
};