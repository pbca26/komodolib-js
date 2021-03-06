const bitcoinJSForks = require('bitcoinforksjs-lib');
const bitcoinZcash = require('bitcoinjs-lib-zcash');
const bitcoinPos = require('bitcoinjs-lib-pos');
const bitcoinZcashSapling = require('bitgo-utxo-lib');
const groestlcoinjsLib = require('bitgo-utxo-lib-groestl');
const bitcoin = require('bitcoinjs-lib');
const coinselect = require('coinselect');
const utils = require('./utils');
const {
  multisig,
  stringToWif,
  addressVersionCheck,
  isPrivKey,
} = require('./keys');

const ECPair = require('bitgo-utxo-lib/src/ecpair');
const ECSignature = require('bitgo-utxo-lib/src/ecsignature');

// TODO: eth wrapper

// current multisig limitations: no PoS, no btc forks
// bitcoinjs multisig order doesn't matter
const transaction = (sendTo, changeAddress, wif, network, utxo, changeValue, spendValue, options) => {
  if ((!options && !isPrivKey(wif))||
     (options && !options.unsigned && !isPrivKey(wif))) {
    throw new Error('Invalid WIF format');
  }

  if (!options || (options && options.multisig && options.multisig.creator)) {
    if (addressVersionCheck(network, sendTo) !== true) {
      throw new Error('Invalid output address');
    }
    
    if (addressVersionCheck(network, changeAddress) !== true) {
      throw new Error('Invalid change address');
    }

    if (!utils.isNumber(changeValue) ||
        Number(changeValue) < 0 ||
        !Number.isInteger(changeValue)) {
      throw new Error('Wrong change value');
    }

    if (!utils.isNumber(spendValue) ||
        Number(spendValue) < 0 ||
        !Number.isInteger(spendValue)) {
      throw new Error('Wrong spend value');
    }
  }
    
  if (options &&
      options.multisig) {
    if (!options.multisig.redeemScript) {
      throw new Error('Missing reedeem script string');
    }

    const decodedRedeemScript = multisig.decodeRedeemScript(options.multisig.redeemScript, { toHex: true });
    const signPubkey = stringToWif(wif, network, true).pubHex;

    if (decodedRedeemScript.pubKeys.indexOf(signPubkey) === -1) {
      throw new Error('Wrong multisig signing key or redeem sript');
    }
  }

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
  } else if (network.isGRS) {
    tx = new groestlcoinjsLib.TransactionBuilder(network);
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
        const scriptPubKey = network && network.isZcash ? bitcoinZcash.script.scriptHash.output.encode(bitcoin.crypto.hash160(Buffer.from(options.multisig.redeemScript, 'hex'))) : bitcoin.script.scriptHash.output.encode(bitcoin.crypto.hash160(Buffer.from(options.multisig.redeemScript, 'hex')));
        tx.addInput(utxo[i].txid, utxo[i].vout, 0, null, scriptPubKey);
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
      const data = Buffer.from(options.opreturn, 'utf8');
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
      if ((network.saplingActivationHeight && utxo[0].currentHeight >= network.saplingActivationHeight) ||
          (network.saplingActivationTimestamp && Math.floor(Date.now() / 1000) > network.saplingActivationTimestamp)) {
        tx.setVersion(4);
      } else {
        tx.setVersion(1);
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
          tx.sign(i, key, new Buffer.from(options.multisig.redeemScript, 'hex'), null, Number(utxo[i].value));
        } else {
          tx.sign(i, key, '', null, Number(utxo[i].value));
        }
      } else {
        if (options &&
            options.multisig) {
          tx.sign(i, key, new Buffer.from(options.multisig.redeemScript, 'hex'), null, Number(utxo[i].value));
        } else {
          tx.sign(i, key);
        }
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

const multisigSignTransaction = (wif, network, utxo, options) => {
  return transaction(null, null, wif, network, utxo, null, null, options);
}; 

// TODO: merge sendmany
const data = (network, value, fee, outputAddress, changeAddress, utxoList) => {
  if (addressVersionCheck(network, outputAddress) !== true) {
    throw new Error('Invalid output address');
  }
  
  if (addressVersionCheck(network, changeAddress) !== true) {
    throw new Error('Invalid change address');
  }

  if (!utils.isNumber(value) ||
      !utils.isPositiveNumber(value) ||
      !Number.isInteger(value)) {
    throw new Error('Wrong value');
  }

  if (!fee.hasOwnProperty('perByte') &&
      (!utils.isNumber(fee) ||
      !utils.isPositiveNumber(fee) ||
      !Number.isInteger(fee))) {
    throw new Error('Wrong fee');
  }

  if (fee.hasOwnProperty('perByte') &&
      (!utils.isNumber(fee.value) ||
      !utils.isPositiveNumber(fee.value) ||
      !Number.isInteger(fee.value))) {
    throw new Error('Wrong fee');
  }

  const btcFee = fee.hasOwnProperty('perByte') ? fee.value : null; // TODO: coin non specific switch static/dynamic fee
  const inputValue = value;

  if (btcFee) {
    fee = 0;
  }

  if (utxoList &&
      utxoList.length &&
      utxoList[0] &&
      utxoList[0].txid) {
    const utxoListFormatted = [];
    const interestClaimThreshold = 200;
    let totalInterest = 0;
    let totalInterestUTXOCount = 0;
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
      throw new Error('Spend value is too large');
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
      throw new Error('Can\'t find best fit utxo. Try lower amount.');
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

    if (vinSum === inputValue + fee &&
        _change > 0) {
      _change = 0;
    }

    return {
      outputAddress,
      changeAddress,
      network,
      change: _change,
      value: inputValue <= _maxSpendBalance && totalInterest <= 0 ? inputValue : value,
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
  
  throw new Error ('No valid UTXO');
}; 

// sapling based coins require input value in order to calculate signature hash
const checkSignatures = (utxo, rawtx, redeemScript, network) => {
  const txb = new bitcoinZcashSapling.TransactionBuilder.fromTransaction(bitcoinZcashSapling.Transaction.fromHex(rawtx, network), network);
  
  let pubKeySigCount = {};
  let pubKeySigComplete = [];
  let decodedRedeemScript;

  for (let i = 0; i < txb.inputs.length; i++) {
    const input = txb.inputs[i];

    if (input.pubKeys &&
        input.pubKeys.length) {
      for (let j = 0; j < input.pubKeys.length; j++) {
        if (input.signatures[j]) {
          if (input.signScript.toString('hex') !== redeemScript) {
            throw new Error('Wrong reedeem script value');
          }

          decodedRedeemScript = multisig.decodeRedeemScript(input.signScript.toString('hex'), { toHex: true });

          const parsedSig = ECSignature.parseScriptSignature(input.signatures[j]);
          const keyPair = ECPair.fromPublicKeyBuffer(input.pubKeys[j]);
          let hash;

          if (network.isZcash) {
            hash = txb.tx.hashForZcashSignature(i, input.signScript, utxo[i].value, parsedSig.hashType);
          } else if (
            network.hasOwnProperty('forkName') &&
            network.forkName === 'bch'
          ) {
            hash = txb.tx.hashForCashSignature(i, input.signScript, utxo[i].value, parsedSig.hashType);
          } else if (
            network.hasOwnProperty('forkName') &&
            network.forkName === 'btg'
          ) {
            hash = txb.tx.hashForGoldSignature(i, input.signScript, utxo[i].value, parsedSig.hashType);
          } else {
            hash = txb.tx.hashForSignature(i, input.signScript, parsedSig.hashType);
          }

          const verifySig = keyPair.verify(hash, parsedSig.signature);

          if (decodedRedeemScript.pubKeys.indexOf(input.pubKeys[j].toString('hex')) > -1 &&
              verifySig) {
            if (!pubKeySigCount[input.pubKeys[j].toString('hex')]) {
              pubKeySigCount[input.pubKeys[j].toString('hex')] = 1;
            } else {
              pubKeySigCount[input.pubKeys[j].toString('hex')]++;
            }
          }
        } else {
          decodedRedeemScript = multisig.decodeRedeemScript(redeemScript, { toHex: true });
        }
      }
    } else {
      decodedRedeemScript = multisig.decodeRedeemScript(redeemScript, { toHex: true });
    }
  }

  for (let key in pubKeySigCount) {
    if (pubKeySigCount[key] === txb.inputs.length) {
      pubKeySigComplete.push(key);
    }
  }

  return {
    signatures: {
      required: decodedRedeemScript.m,
      verified: Object.keys(pubKeySigCount).length,
    },
    pubKeys: pubKeySigComplete, 
  };
}

module.exports = {
  data,
  transaction,
  multisig: {
    checkSignatures,
    sign: multisigSignTransaction,
  },
};