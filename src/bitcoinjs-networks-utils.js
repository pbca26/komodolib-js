const networks = require('./bitcoinjs-networks.js');

const bip32Compatible = () => {
  let _items = [];

  for (let key in networks) {
    if (networks[key].bip32) {
      _items.push(networks[key]);
    }
  }

  return _items;
};

const bip44Compatible = () => {
  let _items = [];

  for (let key in networks) {
    if (networks[key].bip32 &&
        networks[key].bip44) {
      _items.push(networks[key]);
    }
  }

  return _items;
};

module.exports = {
  bip32Compatible,
  bip44Compatible,
};