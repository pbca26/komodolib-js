'use strict';

/*
  Note: to make these functions work please include trezor connect in your web app
  <script src="https://connect.trezor.io/7/trezor-connect.js"></script>
  Default KMD path (asset chains included): m/44'/141'/0'/0/0
*/

var getAddress = function getAddress() {
  var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "m/44'/141'/0'/0/0";

  return new Promise(function (resolve, reject) {
    TrezorConnect.getAddress({
      path: path,
      showOnTrezor: true
    }).then(function (res) {
      if (res.payload.hasOwnProperty('address')) {
        resolve(res.payload.address);
      } else {
        reject(res);
      }
    });
  });
};

// TODO: non-overwintered coins support, coin agnostic
// txBuilderData is a data obj returned from running trasaction-builder.js data function
var signTransaction = async function signTransaction(coin, _utxoList, txBuilderData) {
  var utxoList = [];

  for (var i = 0; i < _utxoList.length; i++) {
    for (var j = 0; j < txBuilderData.inputs.length; j++) {
      if (_utxoList[i].txid === txBuilderData.inputs[j].txid && _utxoList[i].vout === txBuilderData.inputs[j].vout && _utxoList[i].amountSats === txBuilderData.inputs[j].value) {
        utxoList.push(_utxoList[i]);
      }
    }
  }

  console.log('trezor sign filtered utxos', utxoList);

  return new Promise(function (resolve, reject) {
    var tx = {
      versionGroupId: 2301567109, // zec sapling forks only
      branchId: 1991772603, // zec sapling forks only
      overwintered: true, // zec sapling forks only
      version: 4, // zec sapling forks only
      push: false,
      coin: 'kmd',
      outputs: [],
      inputs: [],
      refTxs: []
    };

    // note: fails to sign tx version 1, throws "Illegal str: Length not a multiple of 2" error
    // https://github.com/trezor/connect/issues/409
    if (coin === 'zilla' || coin === 'oot') {
      tx = {
        version: 1,
        push: false,
        coin: 'kmd',
        outputs: [],
        inputs: [],
        refTxs: []
      };
    }

    if (coin === 'kmd') {
      tx.locktime = Math.floor(Date.now() / 1000) - 777;
    }

    for (var _i = 0; _i < utxoList.length; _i++) {
      tx.inputs.push({
        address_n: [(44 | 0x80000000) >>> 0, (141 | 0x80000000) >>> 0, (0 | 0x80000000) >>> 0, 0, 0],
        prev_index: utxoList[_i].vout,
        prev_hash: utxoList[_i].txid,
        amount: utxoList[_i].amountSats.toString()
      });
    }

    if (txBuilderData.change > 0) {
      tx.outputs.push({
        address_n: [(44 | 0x80000000) >>> 0, (141 | 0x80000000) >>> 0, (0 | 0x80000000) >>> 0, 0, 0],
        amount: txBuilderData.change.toString(),
        script_type: 'PAYTOADDRESS'
      });
    }

    tx.outputs.push({
      address: txBuilderData.outputAddress,
      amount: txBuilderData.value.toString(),
      script_type: 'PAYTOADDRESS'
    });

    for (var _i2 = 0; _i2 < utxoList.length; _i2++) {
      tx.refTxs.push({
        hash: utxoList[_i2].txid,
        inputs: [],
        bin_outputs: [],
        version: utxoList[_i2].decodedTx.format.version,
        lock_time: utxoList[_i2].decodedTx.format.locktime
      });

      for (var _j = 0; _j < utxoList[_i2].decodedTx.inputs.length; _j++) {
        tx.refTxs[_i2].inputs.push({
          prev_hash: utxoList[_i2].decodedTx.inputs[_j].txid,
          prev_index: utxoList[_i2].decodedTx.inputs[_j].n,
          script_sig: utxoList[_i2].decodedTx.inputs[_j].script,
          sequence: utxoList[_i2].decodedTx.inputs[_j].sequence
        });
      }

      for (var _j2 = 0; _j2 < utxoList[_i2].decodedTx.outputs.length; _j2++) {
        tx.refTxs[_i2].bin_outputs.push({
          amount: utxoList[_i2].decodedTx.outputs[_j2].satoshi,
          script_pubkey: utxoList[_i2].decodedTx.outputs[_j2].scriptPubKey.hex
        });
      }
    }

    console.log('trezor tx coin ' + coin);
    console.log('trezor tx obj', tx);

    TrezorConnect.signTransaction(tx).then(function (res) {
      console.log('trezor tx sign response', res);

      if (res.payload.hasOwnProperty('error')) {
        reject(res.payload);
      } else {
        resolve(res.payload.serializedTx);
      }
    });
  });
};

module.exports = {
  getAddress: getAddress,
  signTransaction: signTransaction
};