const {kmd} = require('../bitcoinjs-networks');
const p2pkh = require('bitcoinjs-lib/src/templates/pubkeyhash');

const getAddress = publicKey => p2pkh({
  pubkey: publicKey,
  network: kmd,
}).address;

export default getAddress;
