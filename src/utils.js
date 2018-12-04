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
  }
  return data.sort((b, a) => {
    if (a[sortKey] < b[sortKey]) {
      return -1;
    }

    if (a[sortKey] > b[sortKey]) {
      return 1;
    }

    return 0;
  });
};

const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min; // the maximum is inclusive and the minimum is inclusive
};

const getRandomElectrumServer = (servers, excludeServer) => {
  let randomServer;
  const _servers = [];

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
};

const isNumber = value => !isNaN(parseFloat(value)) && isFinite(value);

const isPositiveNumber = value => isNumber(value) && (+value) > 0;

// display rounding
const formatValue = (value) => {
  if (value.toString().indexOf('.') === -1) {
    return value;
  }
  // ref: https://stackoverflow.com/questions/3612744/remove-insignificant-trailing-zeros-from-a-number
  const c = Math.pow(10, 8); // 8 decimal places
  const newVal = Math.trunc(value * c) / c;
  const str = newVal.toString();
  const splitNum = str.split('.');

  if (Number(splitNum[0]) !== 0) {
    return newVal.toFixed(4);
  }
  return newVal;
};

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
    'YB',
  ];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const estimateTxSize = (numVins, numOuts) => numVins * 180 + numOuts * 34 + 11;


const maxSpendBalance = (utxoList, fee) => {
  let maxSpendBalance = 0;

  for (let i = 0; i < utxoList.length; i++) {
    maxSpendBalance += Number(utxoList[i].value);
  }

  if (fee) {
    return Number(maxSpendBalance) - Number(fee);
  }
  return maxSpendBalance;
};

const fromSats = value => value * 0.00000001;

const toSats = value => Number(value).toFixed(8) * 100000000;

// https://stackoverflow.com/questions/5467129/sort-javascript-object-by-key
const sortObject = o => Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {});

// ref: https://gist.github.com/matthewhudson/7999278 
const parseBitcoinURL = (url) => {
  const r = /^[a-zA-Z0-9]*:([a-zA-Z0-9]{27,34})(?:\?(.*))?$/;
  const match = r.exec(url);
  
  if (!match) return null;

  let parsed = { url };

  if (match[2]) {
    const queries = match[2].split('&');

    for (let i = 0; i < queries.length; i++) {
      const query = queries[i].split('=');
      
      if (query.length == 2) {
        parsed[query[0]] = decodeURIComponent(query[1].replace(/\+/g, '%20'));
      }
    }
  }

  parsed.address = match[1];
  return parsed;
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
  sortObject,
  parseBitcoinURL,
};
