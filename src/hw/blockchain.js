// the following code assumes that insight explorer api is used
const fetch = require('node-fetch');

let explorerUrl;

const setExplorerUrl = (url) => {
  explorerUrl = url;
};

const get = async (endpoint, postData) => {
  const opts = {};

  if (postData) {
    opts.body = JSON.stringify(postData);
    opts.method = 'POST';
  }

  const response = await fetch(`${explorerUrl}${endpoint}`, opts.method === 'GET' ? {
    method: opts.method,
    headers: {
      'Content-Type': 'application/json',
    },
  } : {
    method: opts.method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(opts.body),
  });
  const isJson = response.headers.get('Content-Type').includes('application/json');

  const body = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw new Error(body);
  }

  return body;
};

const getAddress = address => get(`addr/${address}/?noTxList=1`);

const getAddressHistory = (address) => get(`/txs?address=${address}`);

const getHistory = addresses => get(`addrs/txs`, {addrs: addresses.join(',')});

const getUtxos = addresses => get(`addrs/utxo`, {addrs: addresses.join(',')});

const getTransaction = txid => get(`tx/${txid}`);

const getRawTransaction = txid => get(`rawtx/${txid}`);

const getBestBlockHash = () => get('status?q=getBestBlockHash');

const getBlock = blockHash => get(`block/${blockHash}`);

const getTipTime = async () => {
  const {bestblockhash} = await getBestBlockHash();
  const block = await getBlock(bestblockhash);

  return block.time;
};

const broadcast = transaction => get('tx/send', {rawtx: transaction});

const getInfo = () => get('/status?q=getInfo');

module.exports = {
  get,
  getAddress,
  getUtxos,
  getAddressHistory,
  getHistory,
  getTransaction,
  getRawTransaction,
  getBestBlockHash,
  getBlock,
  getTipTime,
  broadcast,
  setExplorerUrl,
  getInfo,
};