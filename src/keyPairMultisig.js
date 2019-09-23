// TODO: more convert methods, subclasses(?)

const {
  stringToWif,
  pubToElectrumScriptHashHex,
  multisig,
} = require('./keys');
const networks = require('./bitcoinjs-networks-all');

class keyPairMultisig {
  constructor(str, redeemScript, network = 'kmd') {
    this.str = str;
    this.network = network;
    this.wif = stringToWif(str, networks[network], true).priv !== stringToWif(str, networks[network], true).pub ? stringToWif(str, networks[network], true).priv : null;
    this.pub = multisig.redeemScriptToPubAddress(redeemScript, networks[network]);
    this.pubKey = multisig.redeemScriptToScriptPubKey(redeemScript, networks[network]);
    this.redeemScript = {
      raw: redeemScript,
      decoded: multisig.decodeRedeemScript(redeemScript, networks[network]),
    };
  }

  toPub(network) {
    if (network &&
        !networks[network]) {
      throw new Error('wrong network name');
    }

    return multisig.redeemScriptToPubAddress(this.redeemScript, this.network);
  }

  toElectrumScriptHash(network) {
    if (network &&
        !networks[network]) {
      throw new Error('wrong network name');
    }

    return pubToElectrumScriptHashHex(this.pub, network ? networks[network] : networks[this.network]);
  }
}

module.exports = keyPairMultisig;