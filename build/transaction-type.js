'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var transactionType = function transactionType(tx, targetAddress, isKomodo, skipTargetAddress) {
  // TODO: - sum vins / sum vouts to the same address
  //       - multi vin multi vout
  //       - detect change address
  //       - double check for exact sum input/output values
  var result = [];
  var _parse = {
    inputs: {},
    outputs: {}
  };
  var _sum = {
    inputs: 0,
    outputs: 0
  };
  var _total = {
    inputs: 0,
    outputs: 0
  };
  var _addresses = {
    inputs: [],
    outputs: []
  };

  if (tx.format === 'cant parse') {
    return {
      type: 'unknown',
      amount: 'unknown',
      address: targetAddress,
      timestamp: tx.timestamp,
      txid: tx.format.txid,
      confirmations: tx.confirmations
    };
  }

  for (var key in _parse) {
    if (!tx[key].length) {
      _parse[key] = [];
      _parse[key].push(tx[key]);
    } else {
      _parse[key] = tx[key];
    }

    for (var i = 0; i < _parse[key].length; i++) {
      _total[key] += Number(_parse[key][i].value);

      // ignore op return outputs
      if (_parse[key][i].scriptPubKey && _parse[key][i].scriptPubKey.addresses && _parse[key][i].scriptPubKey.addresses[0] && _parse[key][i].scriptPubKey.addresses[0] === targetAddress && _parse[key][i].value) {
        _sum[key] += Number(_parse[key][i].value);
      }

      if (_parse[key][i].scriptPubKey && _parse[key][i].scriptPubKey.addresses && _parse[key][i].scriptPubKey.addresses[0]) {
        _addresses[key].push(_parse[key][i].scriptPubKey.addresses[0]);

        if (_parse[key][i].scriptPubKey.addresses[0] === targetAddress && skipTargetAddress) {
          _addresses[key].pop();
        }
      }
    }
  }

  _addresses.inputs = [].concat(_toConsumableArray(new Set(_addresses.inputs)));
  _addresses.outputs = [].concat(_toConsumableArray(new Set(_addresses.outputs)));

  var isSelfSend = {
    inputs: false,
    outputs: false
  };

  for (var _key in _parse) {
    for (var _i = 0; _i < _addresses[_key].length; _i++) {
      if (_addresses[_key][_i] === targetAddress && _addresses[_key].length === 1) {
        isSelfSend[_key] = true;
      }
    }
  }

  if (_sum.inputs > 0 && _sum.outputs > 0) {
    // vin + change, break into two tx

    // send to self
    if (isSelfSend.inputs && isSelfSend.outputs) {
      result = {
        type: 'self',
        amount: Number(_sum.inputs - _sum.outputs).toFixed(8),
        address: targetAddress,
        timestamp: tx.timestamp,
        txid: tx.format.txid,
        confirmations: tx.confirmations
      };

      if (isKomodo) {
        // calc claimed interest amount
        var vinVoutDiff = _total.inputs - _total.outputs;

        if (vinVoutDiff < 0) {
          result.interest = Number(vinVoutDiff.toFixed(8));
        }
      }
    } else {
      result = [{ // reorder since tx sort by default is from newest to oldest
        type: 'sent',
        amount: Number(_sum.inputs.toFixed(8)),
        address: _addresses.outputs[0],
        timestamp: tx.timestamp,
        txid: tx.format.txid,
        confirmations: tx.confirmations,
        inputAddresses: _addresses.inputs,
        outputAddresses: _addresses.outputs
      }, {
        type: 'received',
        amount: Number(_sum.outputs.toFixed(8)),
        address: targetAddress,
        timestamp: tx.timestamp,
        txid: tx.format.txid,
        confirmations: tx.confirmations,
        inputAddresses: _addresses.inputs,
        outputAddresses: _addresses.outputs
      }];

      if (isKomodo) {
        // calc claimed interest amount
        var _vinVoutDiff = _total.inputs - _total.outputs;

        if (_vinVoutDiff < 0) {
          result[1].interest = Number(_vinVoutDiff.toFixed(8));
        }
      }
    }
  } else if (_sum.inputs === 0 && _sum.outputs > 0) {
    result = {
      type: 'received',
      amount: Number(_sum.outputs.toFixed(8)),
      address: targetAddress,
      timestamp: tx.timestamp,
      txid: tx.format.txid,
      confirmations: tx.confirmations,
      inputAddresses: _addresses.inputs,
      outputAddresses: _addresses.outputs
    };
  } else if (_sum.inputs > 0 && _sum.outputs === 0) {
    result = {
      type: 'sent',
      amount: Number(_sum.inputs.toFixed(8)),
      address: isSelfSend.inputs && isSelfSend.outputs ? targetAddress : _addresses.outputs[0],
      timestamp: tx.timestamp,
      txid: tx.format.txid,
      confirmations: tx.confirmations,
      inputAddresses: _addresses.inputs,
      outputAddresses: _addresses.outputs
    };
  } else {
    // (?)
    result = {
      type: 'other',
      amount: 'unknown',
      address: 'unknown',
      timestamp: tx.timestamp,
      txid: tx.format.txid,
      confirmations: tx.confirmations
    };
  }

  return result;
};

module.exports = transactionType;