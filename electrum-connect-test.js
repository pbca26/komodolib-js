const connect = require('./src/connect');
const electrumServers  = require('./src/electrum-servers');
const network = require('./src/bitcoinjs-networks');
const { parseBlockToJSON } = require('./src/block');
const keyPair = require('./src/keyPair');

const server = electrumServers.rick.serverList[0].split(':');
const c = connect('electrum', { server: {ip: server[0], port: server[1], protocol: server[2] }});

const address = new keyPair('RNTv4xTLLm26p3SvsQCBy9qNK7s1RgGYSB', 'kmd'); 
const addressSH = address.toElectrumScriptHash();

(async function() {
  c.getCurrentBlockNumber()
  .then((res) => {
    console.log(res);
  });

  await c.getServerVersion()
  .then((res) => {
    if (!res.error) {
      c.setProtocolVersion(Number(res[1]));
      console.log(c);
    }
  });

  c.getTransaction('33a6c70c658ccf312ee55baddec0192695ba7ca098e4f58fe2ca3ee591a2740e', 530930)
  .then((res) => {
    console.log(res);
  });

  c.getBlockInfo(580285)
  .then((res) => {
    console.log(res);
  });

  // scripthash form
  c.getBalance(addressSH)
  .then((res) => {
    console.log(res);
  });

  // scripthash form
  c.getHistory(addressSH)
  .then((res) => {
    console.log(res);
  });

  // scripthash form
  c.getUTXO(addressSH)
  .then((res) => {
    console.log(res);
  });

  c.getBlockInfo('1')
  .then((res) => {
    console.log(res);

    res = parseBlockToJSON(res, network.kmd);

    console.log(res);
  });
})();