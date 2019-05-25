const transactionType = (tx, targetAddress, isKomodo, options) => {
  // TODO: - sum vins / sum vouts to the same address
  //       - multi vin multi vout
  //       - detect change address
  //       - double check for exact sum input/output values
  let result = [];
  const _parse = {
    inputs: {},
    outputs: {},
  };
  const _sum = {
    inputs: 0,
    outputs: 0,
  };
  const _total = {
    inputs: 0,
    outputs: 0,
  };
  const _addresses = {
    inputs: [],
    outputs: [],
  };

  if (tx.format === 'cant parse') {
    return {
      type: 'unknown',
      amount: 'unknown',
      address: targetAddress,
      timestamp: tx.timestamp,
      txid: tx.format.txid,
      confirmations: tx.confirmations,
    };
  }

  for (const key in _parse) {
    if (!tx[key].length) {
      _parse[key] = [];
      _parse[key].push(tx[key]);
    } else {
      _parse[key] = tx[key];
    }

    for (let i = 0; i < _parse[key].length; i++) {
      _total[key] += Number(_parse[key][i].value);

      // ignore op return outputs
      if (_parse[key][i].scriptPubKey &&
          _parse[key][i].scriptPubKey.addresses &&
          _parse[key][i].scriptPubKey.addresses[0] &&
          _parse[key][i].scriptPubKey.addresses[0] === targetAddress &&
          _parse[key][i].value) {
        _sum[key] += Number(_parse[key][i].value);
      }

      if (_parse[key][i].scriptPubKey &&
          _parse[key][i].scriptPubKey.addresses &&
          _parse[key][i].scriptPubKey.addresses[0]) {
        _addresses[key].push(_parse[key][i].scriptPubKey.addresses[0]);

        if (_parse[key][i].scriptPubKey.addresses[0] === targetAddress &&
            options &&
            options.skipTargetAddress) {
          _addresses[key].pop();
        }
      }
    }
  }

  _addresses.inputs = [...new Set(_addresses.inputs)];
  _addresses.outputs = [...new Set(_addresses.outputs)];

  const isSelfSend = {
    inputs: false,
    outputs: false,
  };

  for (const key in _parse) {
    for (let i = 0; i < _addresses[key].length; i++) {
      if (_addresses[key][i] === targetAddress &&
          _addresses[key].length === 1) {
        isSelfSend[key] = true;
      }
    }
  }

  if (_sum.inputs > 0 &&
      _sum.outputs > 0) {
    // vin + change, break into two tx

    // send to self
    if (isSelfSend.inputs &&
        isSelfSend.outputs) {
      result = {
        type: 'self',
        amount: _sum.inputs === _sum.outputs ? Number(_sum.outputs).toFixed(8) : Number(_sum.inputs - _sum.outputs).toFixed(8),
        amountIn: Number(_sum.inputs).toFixed(8),
        amountOut: Number(_sum.outputs).toFixed(8),
        totalIn: Number(_total.inputs).toFixed(8),
        totalOut: Number(_total.outputs).toFixed(8),
        fee: Number(_total.inputs - _total.outputs).toFixed(8),
        address: targetAddress,
        timestamp: tx.timestamp,
        txid: tx.format.txid,
        confirmations: tx.confirmations,
      };

      if (isKomodo) { // calc claimed interest amount
        const vinVoutDiff = _total.inputs - _total.outputs;

        if (vinVoutDiff < 0) {
          result.interest = Number(vinVoutDiff.toFixed(8));
        }
      }
    } else {
      result = {
        type: 'sent',
        amount: Number(isKomodo && (_sum.inputs - _sum.outputs) < 0 ? _total.outputs - _sum.outputs : _sum.inputs - _sum.outputs).toFixed(8),
        amountIn: Number(_sum.inputs).toFixed(8),
        amountOut: Number(_sum.outputs).toFixed(8),
        totalIn: Number(_total.inputs).toFixed(8),
        totalOut: Number(_total.outputs).toFixed(8),
        fee: Number(_total.inputs - _total.outputs).toFixed(8),
        address: _addresses.outputs[0],
        timestamp: tx.timestamp,
        txid: tx.format.txid,
        confirmations: tx.confirmations,
        from: _addresses.inputs,
        to: _addresses.outputs,
      };

      if (isKomodo) { // calc claimed interest amount
        const vinVoutDiff = _total.inputs - _total.outputs;

        if (vinVoutDiff < 0) {
          result.interest = Number(vinVoutDiff.toFixed(8));
        }
      }
    }
  } else if (
    _sum.inputs === 0 &&
    _sum.outputs > 0
  ) {
    result = {
      type: 'received',
      amount: Number(_sum.outputs).toFixed(8),
      amountIn: Number(_sum.inputs).toFixed(8),
      amountOut: Number(_sum.outputs).toFixed(8),
      totalIn: Number(_total.inputs).toFixed(8),
      totalOut: Number(_total.outputs).toFixed(8),
      fee: Number(_total.inputs - _total.outputs).toFixed(8),
      address: targetAddress,
      timestamp: tx.timestamp,
      txid: tx.format.txid,
      confirmations: tx.confirmations,
      inputAddresses: _addresses.inputs,
      outputAddresses: _addresses.outputs,
    };
  } else if (
    _sum.inputs > 0 &&
    _sum.outputs === 0
  ) {
    result = {
      type: 'sent',
      amount: Number(_sum.inputs).toFixed(8),
      amountIn: Number(_sum.inputs).toFixed(8),
      amountOut: Number(_sum.outputs).toFixed(8),
      totalIn: Number(_total.inputs).toFixed(8),
      totalOut: Number(_total.outputs).toFixed(8),
      fee: Number(_total.inputs - _total.outputs).toFixed(8),
      address: isSelfSend.inputs && isSelfSend.outputs ? targetAddress : _addresses.outputs[0],
      timestamp: tx.timestamp,
      txid: tx.format.txid,
      confirmations: tx.confirmations,
      inputAddresses: _addresses.inputs,
      outputAddresses: _addresses.outputs,
    };

    if (isKomodo) { // calc claimed interest amount
      const vinVoutDiff = _total.inputs - _total.outputs;

      if (vinVoutDiff < 0) {
        result.interest = Number(vinVoutDiff.toFixed(8));
      }
    }
  } else {
    // (?)
    result = {
      type: 'other',
      amount: 'unknown',
      address: 'unknown',
      timestamp: tx.timestamp,
      txid: tx.format.txid,
      confirmations: tx.confirmations,
    };
  }

  return result;
};

module.exports = transactionType;