const connect = require('./src/connect');
const networks = require('./src/bitcoinjs-networks');
const { parseBlockToJSON } = require('./src/block');
const keyPair = require('./src/keyPair');
const {
  data,
  transaction,
} = require('./src/transaction-builder');
const { toSats } = require('./src/utils');

const c = connect('insight', { server: 'rick' });

const address = new keyPair('test', 'kmd');

const normalizeUTXO = (utxo) => {
  for (let i = 0; i < utxo.length; i++) {
    utxo[i].value = utxo[i].satoshis;
  }

  return utxo;
};

async function send() {
  let network = JSON.parse(JSON.stringify(networks.kmd));
  delete network.kmdInterest;

  let utxo = await c.getUTXO(address.pub)
  .then((res) => {
    return res;
  });

  utxo = normalizeUTXO(utxo);
  console.log(utxo);
    
  const d = data(
    network,
    toSats(0.0001),
    toSats(0.0001),
    address.pub,
    address.pub,
    utxo
  );

  console.log(d)

  const t = transaction(
    address.pub,
    address.pub,
    address.wif,
    network,
    d.inputs,
    d.change,
    d.value
  );

  console.log(t)

  c.broadcast(t)
  .then((res) => {
    console.log(res);
  });
};

send();