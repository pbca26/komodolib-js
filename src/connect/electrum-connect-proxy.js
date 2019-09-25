// electrum proxy api: https://github.com/pbca26/electrum-proxy
// TODO: check if params are missing, params type check

const fetch = require('node-fetch');

const electrumProxy = [{
  ip: '94.130.225.86',
  port: 80,
}, {
  ip: '94.130.98.74',
  port: 80,
}];

const urlParams = (params) => {
  const query = Object.keys(params)
                .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                .join('&');
  return '?' + query;
}

const serverData = (obj) => {
  return {
    ip: obj.ip,
    port: obj.port,
    proto: obj.connectionProtocol,
    proxy: obj.proxy,
  };
}

const request = (server, options) => {
  return new Promise((resolve, reject) => {
    // TODO: random proxy
    const proxy = options && options.proxy ? proxy : electrumProxy[0];
    const _serverEndpoint = `${proxy.ssl ? 'https' : 'http'}://${proxy.ip}:${proxy.port}`;
    let _urlParams = {
      ip: server.ip,
      port: server.port,
      proto: server.proto,
    };

    if (Number(options.protocolVersion) >= 1.2) {
      _urlParams.eprotocol = options.protocolVersion;
    }

    if (options.address) {
      _urlParams.address = options.address;
    }

    if (options.height) {
      _urlParams.height = options.height;
    }

    if (options.txid) {
      _urlParams.txid = options.txid;
    }

    if (options.blocks) {
      _urlParams.blocks = options.blocks;
    }

    if (options.rawtx) {
      _urlParams.rawtx = options.rawtx;
    }

    const url = `${_serverEndpoint}/api/${options.url}${options.method === 'GET' ? urlParams(_urlParams) : ''}`;

    fetch(
      url,
      options.method === 'GET' ? {
        method: options.method,
        headers: {
          'Content-Type': 'application/json',
        },
      } : {
        method: options.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(_urlParams),
      }
    )
    .catch((error) => {
      console.log(error);
      reject(error)
    })
    .then(response => response.json())
    .then(json => {
      // console.log(json);
      if (json.msg === 'success') {
        resolve(json.result);
      } else {
        resolve(options.method === 'GET' ? {
          error: json.result,
          method: options.method,
          url,
        } : {
          error: json.result,
          method: options.method,
          url,
          body: JSON.stringify(_urlParams),
        });
      }
    });
  });
}

class electrumConnnect {
  constructor(server, options = void 0) {
    this.port = server.port;
    this.ip = server.ip;
    this.connectionProtocol = server.protocol || 'tcp';
    this.protocolVersion = null;
    this.proxy = options && options.proxy ? options.proxy : null;
  }

  setProtocolVersion(version) {
    this.protocolVersion = version;
  }

  getServerVersion() {
    return request(serverData(this), {
      method: 'GET',
      url: '/server/version',
      protocolVersion: this.protocolVersion,
    });
  }

  // chain tip
  getCurrentBlockNumber() {
    return request(serverData(this), {
      method: 'GET',
      url: 'getcurrentblock',
      protocolVersion: this.protocolVersion,
    });
  }

  getBalance(address) {
    return request(serverData(this), {
      method: 'GET',
      url: 'getbalance',
      protocolVersion: this.protocolVersion,
      address,
    });
  }

  // TODO: extended usage
  getHistory(address) {
    return request(serverData(this), {
      method: 'GET',
      url: 'listtransactions',
      protocolVersion: this.protocolVersion,
      address,
    });
  }

  getUTXO(address) {
    return request(serverData(this), {
      method: 'GET',
      url: 'listunspent',
      protocolVersion: this.protocolVersion,
      address,
    });
  }

  getBlockInfo(height) {
    return request(serverData(this), {
      method: 'GET',
      url: 'getblockinfo',
      protocolVersion: this.protocolVersion,
      height,
    });
  }

  getTransaction(txid) {
    return request(serverData(this), {
      method: 'GET',
      url: 'gettransaction',
      protocolVersion: this.protocolVersion,
      txid,
    });
  }

  getMerkle(txid, height) {
    return request(serverData(this), {
      method: 'GET',
      url: 'getmerkle',
      protocolVersion: this.protocolVersion,
      txid,
      height,
    });
  }

  getFeeEstimate(blocks) {
    return request(serverData(this), {
      method: 'GET',
      url: 'estimatefee',
      protocolVersion: this.protocolVersion,
      blocks,
    });
  }

  broadcast(rawtx) {
    return request(serverData(this), {
      method: 'POST',
      url: 'pushtx',
      protocolVersion: this.protocolVersion,
      rawtx,
    });
  }
}

module.exports = electrumConnnect;