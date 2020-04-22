'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var transactionType = function transactionType(tx, targetAddress, options) {
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

  if (_typeof(tx.format) !== 'object' || tx.format === null) {
    return {
      type: 'unknown',
      amount: 'unknown',
      address: targetAddress,
      timestamp: tx.timestamp && Number(tx.timestamp) || 'unknown',
      txid: tx.format && tx.format.txid || 'unknown',
      confirmations: tx.confirmations && Number(tx.confirmations) || 'unknown'
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

        if (_parse[key][i].scriptPubKey.addresses[0] === targetAddress && options && options.skipTargetAddress) {
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
        amount: _sum.inputs === _sum.outputs ? Number(Number(_sum.outputs).toFixed(8)) : Number(Number(_sum.inputs - _sum.outputs).toFixed(8)),
        amountIn: Number(Number(_sum.inputs).toFixed(8)),
        amountOut: Number(Number(_sum.outputs).toFixed(8)),
        totalIn: Number(Number(_total.inputs).toFixed(8)),
        totalOut: Number(Number(_total.outputs).toFixed(8)),
        fee: Number(Number(_total.inputs - _total.outputs).toFixed(8)),
        address: targetAddress,
        timestamp: tx.timestamp && Number(tx.timestamp) || 'unknown',
        txid: tx.format.txid || 'unknown',
        confirmations: tx.confirmations && Number(tx.confirmations) || 'unknown'
      };

      if (options && options.isKomodo) {
        // calc claimed interest amount
        var vinVoutDiff = _total.inputs - _total.outputs;

        if (vinVoutDiff < 0) {
          result.interest = Math.abs(Number(vinVoutDiff.toFixed(8)));

          if (result.amount < 0) {
            result.amount = Number(Number(_total.outputs).toFixed(8));
          }
        }
      }
    } else {
      result = {
        type: 'sent',
        amount: Number(Number(options && options.isKomodo && _sum.inputs - _sum.outputs < 0 ? _total.outputs - _sum.outputs : _sum.inputs - _sum.outputs).toFixed(8)),
        amountIn: Number(Number(_sum.inputs).toFixed(8)),
        amountOut: Number(Number(_sum.outputs).toFixed(8)),
        totalIn: Number(Number(_total.inputs).toFixed(8)),
        totalOut: Number(Number(_total.outputs).toFixed(8)),
        fee: Number(Number(_total.inputs - _total.outputs).toFixed(8)),
        address: _addresses.outputs[0],
        timestamp: tx.timestamp && Number(tx.timestamp) || 'unknown',
        txid: tx.format.txid || 'unknown',
        confirmations: tx.confirmations && Number(tx.confirmations) || 'unknown',
        from: _addresses.inputs,
        to: _addresses.outputs
      };

      if (options && options.isKomodo) {
        // calc claimed interest amount
        var _vinVoutDiff = _total.inputs - _total.outputs;

        if (_vinVoutDiff < 0) {
          result.interest = Math.abs(Number(_vinVoutDiff.toFixed(8)));
        }
      }
    }
  } else if (_sum.inputs === 0 && _sum.outputs > 0) {
    result = {
      type: 'received',
      amount: Number(Number(_sum.outputs).toFixed(8)),
      amountIn: Number(Number(_sum.inputs).toFixed(8)),
      amountOut: Number(Number(_sum.outputs).toFixed(8)),
      totalIn: Number(Number(_total.inputs).toFixed(8)),
      totalOut: Number(Number(_total.outputs).toFixed(8)),
      fee: Number(Number(_total.inputs - _total.outputs).toFixed(8)),
      address: targetAddress,
      timestamp: tx.timestamp && Number(tx.timestamp) || 'unknown',
      txid: tx.format.txid || 'unknown',
      confirmations: tx.confirmations && Number(tx.confirmations) || 'unknown',
      inputAddresses: _addresses.inputs,
      outputAddresses: _addresses.outputs
    };
  } else if (_sum.inputs > 0 && _sum.outputs === 0) {
    result = {
      type: 'sent',
      amount: Number(Number(_sum.inputs).toFixed(8)),
      amountIn: Number(Number(_sum.inputs).toFixed(8)),
      amountOut: Number(Number(_sum.outputs).toFixed(8)),
      totalIn: Number(Number(_total.inputs).toFixed(8)),
      totalOut: Number(Number(_total.outputs).toFixed(8)),
      fee: Number(Number(_total.inputs - _total.outputs).toFixed(8)),
      address: isSelfSend.inputs && isSelfSend.outputs ? targetAddress : _addresses.outputs[0],
      timestamp: tx.timestamp && Number(tx.timestamp) || 'unknown',
      txid: tx.format.txid || 'unknown',
      confirmations: tx.confirmations && Number(tx.confirmations) || 'unknown',
      inputAddresses: _addresses.inputs,
      outputAddresses: _addresses.outputs
    };

    if (options && options.isKomodo) {
      // calc claimed interest amount
      var _vinVoutDiff2 = _total.inputs - _total.outputs;

      if (_vinVoutDiff2 < 0) {
        result.interest = Math.abs(Number(_vinVoutDiff2.toFixed(8)));
      }
    }
  } else {
    // (?)
    result = {
      type: 'other',
      amount: 'unknown',
      address: 'unknown',
      timestamp: tx.timestamp && Number(tx.timestamp) || 'unknown',
      txid: tx.format.txid || 'unknown',
      confirmations: tx.confirmations && Number(tx.confirmations) || 'unknown'
    };
  }

  return result;
};

module.exports = transactionType;