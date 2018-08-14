const sort = (data, sortKey, desc) => {
  if (!desc) {
    return data.sort((a, b) => {
      if (a[sortKey] < b[sortKey]) {
        return -1;
      }

      if (a[sortKey] > b[sortKey]) {
        return 1;
      }

      return 0;
    });
  } else {
    return data.sort((b, a) => {
      if (a[sortKey] < b[sortKey]) {
        return -1;
      }

      if (a[sortKey] > b[sortKey]) {
        return 1;
      }

      return 0;
    });
  }
}

const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min; // the maximum is inclusive and the minimum is inclusive
}

const getRandomElectrumServer = (servers, excludeServer) => {
  let randomServer;
  let _servers = [];

  for (let i = 0; i < servers.length; i++) {
    if (excludeServer !== servers[i]) {
      _servers.push(servers[i]);
    }
  }

  // pick a random server to communicate with
  if (_servers &&
      _servers.length > 0) {
    const _randomServerId = getRandomIntInclusive(0, _servers.length - 1);
    const _randomServer = _servers[_randomServerId];
    const _serverDetails = _randomServer.split(':');

    if (_serverDetails.length === 3) {
      return {
        ip: _serverDetails[0],
        port: _serverDetails[1],
        proto: _serverDetails[2],
      };
    }
  } else {
    const _serverDetails = _servers[0].split(':');

    return {
      ip: _serverDetails[0],
      port: _serverDetails[1],
      proto: _serverDetails[2],
    };
  }
}

const isNumber = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

const isPositiveNumber = (value) => {
  return isNumber(value) && (+value) > 0;
}

// display rounding
const formatValue = (formatValue) => {
  const _valueToStr = formatValue.toString();

  if (_valueToStr.indexOf('.') === -1) {
    return formatValue;
  } else {
    if (_valueToStr) {
      const _decimal = _valueToStr.substr(_valueToStr.indexOf('.') + 1, _valueToStr.length);
      let newVal = _valueToStr.substr(0, _valueToStr.indexOf('.') + 1);

      for (let i = 0; i < _decimal.length; i++) {
        if (_decimal[i] === '0') {
          newVal = newVal + _decimal[i];
        } else {
          newVal = newVal + _decimal[i];
          break;
        }
      }

      return newVal;
    }
  }
}

const formatBytes = (bytes, decimals) => {
  if (bytes === 0) {
    return '0 Bytes';
  }

  const k = 1000;
  const dm = (decimals + 1) || 3;
  const sizes = [
    'Bytes',
    'KB',
    'MB',
    'GB',
    'TB',
    'PB',
    'EB',
    'ZB',
    'YB'
  ];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

const estimateTxSize = (numVins, numOuts) => {
  // in x 180 + out x 34 + 10 plus or minus in
  return numVins * 180 + numOuts * 34 + 11;
}

const maxSpendBalance = (utxoList, fee) => {
  let maxSpendBalance = 0;

  for (let i = 0; i < utxoList.length; i++) {
    maxSpendBalance += Number(utxoList[i].value);
  }

  if (fee) {
    return Number(maxSpendBalance) - Number(fee);
  } else {
    return maxSpendBalance;
  }
}

const fromSats = (value) => {
  return value * 0.00000001;
}

const toSats = (value) => {
  return Number(value).toFixed(8) * 100000000;
}

module.exports = {
  formatValue,
  formatBytes,
  sort,
  getRandomIntInclusive,
  getRandomElectrumServer,
  estimateTxSize,
  maxSpendBalance,
  fromSats,
  toSats,
  isNumber,
  isPositiveNumber,
};