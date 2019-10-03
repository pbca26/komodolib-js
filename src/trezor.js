/*
  Note: to make these functions work please include trezor connect in your web app
  <script src="https://connect.trezor.io/7/trezor-connect.js"></script>
  Default KMD path (asset chains included): m/44'/141'/0'/0/0
*/

const getAddress = (path = "m/44'/141'/0'/0/0") => {
  return new Promise((resolve, reject) => {
    TrezorConnect.getAddress({
      path,
      showOnTrezor: true,
    })
    .then((res) => {
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
const signTransaction = async function (coin, _utxoList, txBuilderData) {
  let utxoList = [];

  for (let i = 0; i < _utxoList.length; i++) {
    for (let j = 0; j < txBuilderData.inputs.length; j++) {
      if (_utxoList[i].txid === txBuilderData.inputs[j].txid &&
          _utxoList[i].vout === txBuilderData.inputs[j].vout &&
          _utxoList[i].amountSats === txBuilderData.inputs[j].value) {
        utxoList.push(_utxoList[i]);
      }
    }
  }

  console.log('trezor sign filtered utxos', utxoList);

  return new Promise((resolve, reject) => {
    let tx = {
      versionGroupId: 2301567109, // zec sapling forks only
      branchId: 1991772603, // zec sapling forks only
      overwintered: true, // zec sapling forks only
      version: 4, // zec sapling forks only
      push: false,
      coin: 'kmd',
      outputs: [],
      inputs: [],
      refTxs: [],
    };

    // note: fails to sign tx version 1, throws "Illegal str: Length not a multiple of 2" error
    // https://github.com/trezor/connect/issues/409
    if (coin === 'zilla' ||
        coin === 'oot') {
      tx = {
        version: 1,
        push: false,
        coin: 'kmd',
        outputs: [],
        inputs: [],
        refTxs: [],
      };
    }

    if (coin === 'kmd') {
      tx.locktime = Math.floor(Date.now() / 1000) - 777;
    }

    for (let i = 0; i < utxoList.length; i++) {
      tx.inputs.push({
        address_n: [(44 | 0x80000000) >>> 0, (141 | 0x80000000) >>> 0, (0 | 0x80000000) >>> 0, 0, 0],
        prev_index: utxoList[i].vout,
        prev_hash: utxoList[i].txid,
        amount: utxoList[i].amountSats.toString(),
      });
    }

    if (txBuilderData.change > 0) {
      tx.outputs.push({
        address_n: [(44 | 0x80000000) >>> 0, (141 | 0x80000000) >>> 0, (0 | 0x80000000) >>> 0, 0, 0],
        amount: txBuilderData.change.toString(),
        script_type: 'PAYTOADDRESS',
      });
    }

    tx.outputs.push({
      address: txBuilderData.outputAddress,
      amount: txBuilderData.value.toString(),
      script_type: 'PAYTOADDRESS',
    });

    for (let i = 0; i < utxoList.length; i++) {
      tx.refTxs.push({
        hash: utxoList[i].txid,
        inputs: [],
        bin_outputs: [],
        version: utxoList[i].decodedTx.format.version,
        lock_time: utxoList[i].decodedTx.format.locktime,
      });

      for (let j = 0; j < utxoList[i].decodedTx.inputs.length; j++) {
        tx.refTxs[i].inputs.push({
          prev_hash: utxoList[i].decodedTx.inputs[j].txid,
          prev_index: utxoList[i].decodedTx.inputs[j].n,
          script_sig: utxoList[i].decodedTx.inputs[j].script,
          sequence: utxoList[i].decodedTx.inputs[j].sequence,
        });
      }
    
      for (let j = 0; j < utxoList[i].decodedTx.outputs.length; j++) {
        tx.refTxs[i].bin_outputs.push({
          amount: utxoList[i].decodedTx.outputs[j].satoshi,
          script_pubkey: utxoList[i].decodedTx.outputs[j].scriptPubKey.hex,
        });
      }
    }

    console.log('trezor tx coin ' + coin);
    console.log('trezor tx obj', tx);
    
    TrezorConnect.signTransaction(tx)
    .then((res) => {
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
  getAddress,
  signTransaction,
};