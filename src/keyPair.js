// TODO: more convert methods, subclasses(?)

const {
  addressVersionCheck,
  wifToWif,
  seedToWif,
  stringToWif,
  fromWif,
  pubkeyToAddress,
  etherKeys,
  xpub,
  btcToEthPriv,
  ethToBtcWif,
  ethPrivToPub,
  seedToPriv,
  pubToElectrumScriptHashHex,
  getAddressVersion,
  pubToPub,
  isPrivKey,
} = require('./keys');
const networks = require('./bitcoinjs-networks-all');

const addressTypes = [
  'pubHex',
  'pubAddress',
  'seed',
  'btcWif',
  'ethPriv',
];

class keyPair {
  constructor(str, /*type,*/ network = 'kmd') {    
    this.str = str;
    //this.type = type;
    this.network = network;
    this.wif = stringToWif(str, networks[network], true).priv !== stringToWif(str, networks[network], true).pub ? stringToWif(str, networks[network], true).priv : null;
    this.pub = stringToWif(str, networks[network], true).pub;
    this.pubHex = stringToWif(str, networks[network], true).priv !== stringToWif(str, networks[network], true).pub ? stringToWif(str, networks[network], true).pubHex : null;

    /*if (addressTypes.indexOf(type) === -1) {
      throw new Error('wrong address type');
    }*/
  }

  toETHPub() {
    if (!this.wif) {
      throw new Error('can\'t convert watchonly address to ETH priv');
    }

    return ethPrivToPub(btcToEthPriv(stringToWif(this.str, networks.btc, true).priv));
  }

  toETHPriv() {
    if (!this.wif) {
      throw new Error('can\'t convert watchonly address to ETH priv');
    }

    return btcToEthPriv(stringToWif(this.str, networks.btc, true).priv);
  }

  toWIF(network) {
    if (!this.wif) {
      throw new Error('can\'t convert watchonly address to WIF');
    }

    if (network &&
        !networks[network]) {
      throw new Error('wrong network name');
    }

    return stringToWif(this.str, network ? networks[network] : networks[this.network], true).priv;
  }

  toPub(network) {
    if (network &&
        !networks[network]) {
      throw new Error('wrong network name');
    }

    return stringToWif(this.str, network ? networks[network] : networks[this.network], true).pub;
  }

  toPubHex(network) {
    if (!this.wif) {
      throw new Error('can\'t convert watchonly address to pub key hex');
    }

    if (network &&
        !networks[network]) {
      throw new Error('wrong network name');
    }

    return stringToWif(this.str, network ? networks[network] : networks[this.network], true).pubHex;
  }

  toElectrumScriptHash(network) {
    if (network &&
        !networks[network]) {
      throw new Error('wrong network name');
    }

    return pubToElectrumScriptHashHex(this.pub, network ? networks[network] : networks[this.network]);
  }
}

module.exports = keyPair;