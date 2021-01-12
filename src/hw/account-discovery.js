const blockchain = require('./blockchain');
const getAddress = require('./get-address');
const bitcoin = require('bitcoinjs-lib');

const walkDerivationPath = async node => {
  const addressConcurrency = 10;
  const gapLimit = 20;
  const addresses = [];
  let consecutiveUnusedAddresses = 0;
  let addressIndex = 0;

  while (consecutiveUnusedAddresses < gapLimit) {
    const addressApiRequests = [];

    for (let i = 0; i < addressConcurrency; i++) {
      const address = getAddress(node.derive(addressIndex).publicKey);

      addressApiRequests.push(blockchain.getAddress(address));
      addresses.push({address, addressIndex});

      addressIndex++;
    }

    for (const address of await Promise.all(addressApiRequests)) {
      if (address.totalReceived > 0 || address.unconfirmedBalance > 0) {
        consecutiveUnusedAddresses = 0;
      } else {
        consecutiveUnusedAddresses++;
      }
    }
  }

  return addresses.slice(0, addresses.length - consecutiveUnusedAddresses);
};

const getAccountAddresses = async (account, xpub) => {
  const derivationPath = `44'/141'/${account}'`;
  const node = bitcoin.HDNode.fromBase58(xpub);
  const externalNode = node.derive(0);
  const internalNode = node.derive(1);

  const [externalAddresses, internalAddresses] = await Promise.all([
    walkDerivationPath(externalNode),
    walkDerivationPath(internalNode)
  ]);

  const addAddressMeta = ({isChange}) => {
    return address => ({
      ...address,
      account,
      isChange,
      derivationPath: `${derivationPath}/${isChange ? 1 : 0}/${address.addressIndex}`,
    });
  };

  const addresses = [
    ...externalAddresses.map(addAddressMeta({isChange: false})),
    ...internalAddresses.map(addAddressMeta({isChange: true}))
  ];

  return {
    externalNode,
    internalNode,
    addresses,
    xpub,
  };
};

const getAddressUtxos = async addresses => {
  const utxos = await blockchain.getUtxos(addresses.map(a => a.address));

  return await Promise.all(utxos.map(async utxo => {
    const addressInfo = addresses.find(a => a.address === utxo.address);

    const [
      {rawtx},
      {
        locktime,
        vin,
        vout,
        version
      }
    ] = await Promise.all([
      blockchain.getRawTransaction(utxo.txid),
      blockchain.getTransaction(utxo.txid)
    ]);

    return {
      id: `${utxo.txid}:${utxo.vout}`,
      ...addressInfo,
      ...utxo,
      locktime,
      rawtx,
      inputs: vin,
      outputs: vout,
      version
    };
  }));
};

const getAddressHistory = async addresses => {
  const history = await blockchain.getHistory(addresses.map(a => a.address));

  return {
    addresses: addresses,
    allTxs: history.items,
  };
};

const accountDiscovery = async () => {
  const accounts = [];

  let accountIndex = 0;
  while (true) {
    const account = await getAccountAddresses(accountIndex);

    if (account.addresses.length === 0) {
      account.utxos = [];
      account.history = {
        addresses: [],
        allTxs: [],
        historyParsed: [],
      }; 
      account.accountIndex = accountIndex;
      accounts.push(account);
      return accounts;
    } else {
      account.utxos = await getAddressUtxos(account.addresses);
      account.history = await getAddressHistory(account.addresses); 
      account.accountIndex = accountIndex;
    }

    accounts.push(account);
    accountIndex++;
  }

  return accounts;
};

export default accountDiscovery;
