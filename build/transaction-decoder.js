'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/*
MIT License

Copyright (c) 2017 Yuki Akiyama, SuperNET

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Supported coin types: bitcoin, bitcoin forks BTG and BCH, zcash based coins, PoS type coins

*/

var bitcoinLib = {
  bitcoinPos: {
    main: require('bitcoinjs-lib-pos'),
    script: require('bitcoinjs-lib-pos/src/script'),
    address: require('bitcoinjs-lib-pos/src/address')
  },
  bitcoinZcash: require('bitcoinjs-lib-zcash'),
  bitcoin: require('bitcoinjs-lib')
};
var bitcoin = void 0;

// zcash tx decode fallback
var Buffer = require('safe-buffer').Buffer;

var _require = require('tx-decoder/build/buffer-utils'),
    readSlice = _require.readSlice,
    readInt32 = _require.readInt32,
    readUInt32 = _require.readUInt32;

var _require2 = require('tx-decoder/build/compose'),
    compose = _require2.compose,
    addProp = _require2.addProp;

var _require3 = require('tx-decoder/build/tx-decoder'),
    readInputs = _require3.readInputs,
    readInput = _require3.readInput,
    readOutput = _require3.readOutput;

var crypto = require('crypto');
var _sha256 = function _sha256(data) {
  return crypto.createHash('sha256').update(data).digest();
};

var decodeFormat = function decodeFormat(tx) {
  var result = {
    txid: tx.getId(),
    version: tx.version,
    locktime: tx.locktime
  };

  return result;
};

var decodeInput = function decodeInput(tx, network) {
  var result = [];

  tx.ins.forEach(function (input, n) {
    var vin = {
      txid: !input.hash.reverse ? input.hash : input.hash.reverse().toString('hex'),
      n: input.index,
      script: network.isPoS ? bitcoinLib.bitcoinPos.script.fromHex(input.hash) : bitcoin.script.toASM(input.script),
      sequence: input.sequence
    };

    result.push(vin);
  });

  return result;
};

var decodeOutput = function decodeOutput(tx, network) {
  var format = function format(out, n, network) {
    var vout = {
      satoshi: out.value,
      value: (1e-8 * out.value).toFixed(8),
      n: n,
      scriptPubKey: {
        asm: network.isPoS ? bitcoinLib.bitcoin.script.toASM(out.script.chunks) : bitcoin.script.toASM(out.script),
        hex: network.isPoS ? out.script.toHex() : out.script.toString('hex'),
        type: network.isPoS ? bitcoin.scripts.classifyOutput(out.script) : bitcoin.script.classifyOutput(out.script),
        addresses: []
      }
    };

    switch (vout.scriptPubKey.type) {
      case 'pubkeyhash':
        if (network.isPoS) {
          vout.scriptPubKey.addresses.push(bitcoinLib.bitcoinPos.address.fromOutputScript(out.script, network));
        } else {
          vout.scriptPubKey.addresses.push(bitcoin.address.fromOutputScript(out.script, network));
        }
        break;
      case 'pubkey':
        var pubKeyBuffer = new Buffer(vout.scriptPubKey.asm.split(' ')[0], 'hex');
        vout.scriptPubKey.addresses.push(bitcoin.ECPair.fromPublicKeyBuffer(pubKeyBuffer, network).getAddress());
        break;
      case 'scripthash':
        if (network.isPoS) {
          vout.scriptPubKey.addresses.push(bitcoinLib.bitcoinPos.address.fromOutputScript(out.script, network));
        } else {
          vout.scriptPubKey.addresses.push(bitcoin.address.fromOutputScript(out.script, network));
        }
        break;
    }

    return vout;
  };

  var result = [];

  tx.outs.forEach(function (out, n) {
    result.push(format(out, n, network));
  });

  return result;
};

var transactionDecoder = function transactionDecoder(rawtx, network, debug) {
  if (network.isPoS) {
    bitcoin = bitcoinLib.bitcoinPos.main;
  } else if (network.isZcash) {
    bitcoin = bitcoinLib.bitcoinZcash;
  } else {
    bitcoin = bitcoinLib.bitcoin;
  }

  if (debug) {
    var _tx = bitcoin.Transaction.fromHex(rawtx);

    return {
      tx: _tx,
      network: network,
      format: decodeFormat(_tx),
      inputs: decodeInput(_tx, network),
      outputs: decodeOutput(_tx, network)
    };
  } else {
    if (network.isZcash) {
      var buffer = Buffer.from(rawtx, 'hex');

      var decodeTx = function decodeTx(buffer) {
        return compose([addProp('version', readInt32), // 4 bytes
        addProp('ins', readInputs(readInput)), // 1-9 bytes (VarInt), Input counter; Variable, Inputs
        addProp('outs', readInputs(readOutput)), // 1-9 bytes (VarInt), Output counter; Variable, Outputs
        addProp('locktime', readUInt32) // 4 bytes
        ])({}, buffer);
      };

      var readHash = function readHash(buffer) {
        var _readSlice = readSlice(32)(_sha256(_sha256(buffer))),
            _readSlice2 = _slicedToArray(_readSlice, 2),
            res = _readSlice2[0],
            bufferLeft = _readSlice2[1];

        var hash = Buffer.from(res, 'hex').reverse().toString('hex');
        return [hash, bufferLeft];
      };

      var decodedtx = decodeTx(buffer);
      decodedtx[0].getId = function () {
        return readHash(buffer)[0];
      };

      return {
        tx: decodedtx[0],
        network: network,
        format: decodeFormat(decodedtx[0]),
        inputs: !decodedtx[0].ins.length ? [{ txid: '0000000000000000000000000000000000000000000000000000000000000000' }] : decodeInput(decodedtx[0], network),
        outputs: decodeOutput(decodedtx[0], network)
      };
    } else {
      try {
        var _tx2 = network.isPoS ? bitcoin.Transaction.fromHex(rawtx, network) : bitcoin.Transaction.fromHex(rawtx);

        return {
          tx: _tx2,
          network: network,
          format: decodeFormat(_tx2),
          inputs: decodeInput(_tx2, network),
          outputs: decodeOutput(_tx2, network)
        };
      } catch (e) {
        return false;
      }
    }
  }
};

module.exports = transactionDecoder;