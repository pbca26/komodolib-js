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

const bitcoinLib = {
  bitcoinPos: {
    main: require('bitcoinjs-lib-pos'),
    script: require('bitcoinjs-lib-pos/src/script'),
    address: require('bitcoinjs-lib-pos/src/address'),
  },
  bitcoinZcash: require('bitcoinjs-lib-zcash'),
  bitcoin: require('bitcoinjs-lib'),
};
let bitcoin;

const decodeFormat = (tx) => {
  const result = {
    txid: tx.getId(),
    version: tx.version,
    locktime: tx.locktime,
  };

  return result;
}

const decodeInput = (tx, network) => {
  let result = [];

  tx.ins.forEach((input, n) => {
    const vin = {
      txid: input.hash.reverse().toString('hex'),
      n: input.index,
      script: network.isPoS ? script.fromHex(input.hash) : bitcoin.script.toASM(input.script),
      sequence: input.sequence,
    };

    result.push(vin);
  });

  return result;
}

const decodeOutput = (tx, network) => {
  const format = (out, n, network) => {
    let vout = {
      satoshi: out.value,
      value: (1e-8 * out.value).toFixed(8),
      n: n,
      scriptPubKey: {
        asm: network.isPoS ? bitcoinJS.script.toASM(out.script.chunks) : bitcoin.script.toASM(out.script),
        hex: network.isPoS ? out.script.toHex() : out.script.toString('hex'),
        type: bitcoin.script.classifyOutput(out.script),
        addresses: [],
      },
    };

    switch (vout.scriptPubKey.type) {
      case 'pubkeyhash':
        if (network.isPoS) {
          vout.scriptPubKey.addresses.push(address.fromOutputScript(out.script, network));
        } else {
          vout.scriptPubKey.addresses.push(bitcoin.address.fromOutputScript(out.script, network));
        }
        break;
      case 'pubkey':
        const pubKeyBuffer = new Buffer(vout.scriptPubKey.asm.split(' ')[0], 'hex');
        vout.scriptPubKey.addresses.push(bitcoin.ECPair.fromPublicKeyBuffer(pubKeyBuffer, network).getAddress());
        break;
      case 'scripthash':
        if (network.isPoS) {
          vout.scriptPubKey.addresses.push(address.fromOutputScript(out.script, network));
        } else {
          vout.scriptPubKey.addresses.push(bitcoin.address.fromOutputScript(out.script, network));
        }
        break;
    }

    return vout;
  }

  let result = [];

  tx.outs.forEach((out, n) => {
    result.push(format(out, n, network));
  });

  return result;
}

let transactionDecoder = (rawtx, network, debug) => {
  if (network.isPoS) {
    bitcoin = bitcoinLib.bitcoinPos.main;
  } else if (network.isZcash) {
    bitcoin = bitcoinLib.bitcoinZcash;
  } else {
    bitcoin = bitcoinLib.bitcoin;
  }

  if (debug) {
    const _tx = bitcoin.Transaction.fromHex(rawtx);

    return {
      tx: _tx,
      network: network,
      format: decodeFormat(_tx),
      inputs: decodeInput(_tx),
      outputs: decodeOutput(_tx, network),
    };
  } else {
    try {
      const _tx = bitcoin.Transaction.fromHex(rawtx);

      return {
        tx: _tx,
        network: network,
        format: decodeFormat(_tx),
        inputs: decodeInput(_tx, network),
        outputs: decodeOutput(_tx, network),
      };
    } catch (e) {
      return false;
    }
  }
}

/*transactionDecoder.prototype.decode = () => {
  const self = this;
  let result = {};

  Object.keys(self.format).forEach((key) => {
    result[key] = self.format[key];
  });

  result.outputs = self.outputs;

  return result;
}*/

module.exports = transactionDecoder;