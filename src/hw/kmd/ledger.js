const transport = require('./ledger-transport');
const Btc = require('@ledgerhq/hw-app-btc');
const buildOutputScript = require('./build-output-script');
const bip32Path = require('bip32-path');
const createXpub = require('./create-xpub');

let ledgerFWVersion = 'default';
export let ledgerTransport;

const setLedgerTransport = (transport) => {
  ledgerTransport = transport;
  console.warn(ledgerTransport);
};

const setLedgerFWVersion = name => {
  ledgerFWVersion = name;
  console.warn(ledgerFWVersion);
};

const getLedgerFWVersion = () => {
  return ledgerFWVersion;
};

const resetTransport = () => {
  if (ledgerTransport) {
    if (ledgerFWVersion === 'ble') ledgerTransport.closeConnection();
    ledgerTransport = null;
  }
};

let getDevice = async () => {
  let newTransport;
  let transportType = 'u2f'; // default

  if (ledgerFWVersion === 'webusb') {
    transportType = 'webusb';
  } else if (ledgerFWVersion === 'ble') {
    transportType = 'ble';
  } else if (ledgerFWVersion === 'hid') {
    transportType = 'hid';
  }

  if (ledgerTransport) return ledgerTransport;

  newTransport = await transport[transportType].create();
  const ledger = new Btc(newTransport);

  ledger.close = () => transportType !== 'ble' ? newTransport.close() : {};

  if (transportType === 'ble') {
    ledgerTransport = ledger;
    ledgerTransport.closeConnection = () => newTransport.close();
  }

  return ledger;
};

let isAvailable = async () => {
  const ledger = await getDevice();

  try {
    await ledger.getWalletPublicKey(`m/44'/141'/0'/0/0`, {
      verify: ledgerFWVersion === 'ble',
    });
    await ledger.close();
    return true;
  } catch (error) {
    return false;
  }
};

const getAddress = async (derivationPath, verify) => {
  const ledger = await getDevice();
  const {bitcoinAddress} = await ledger.getWalletPublicKey(derivationPath, {
    verify,
  });
  await ledger.close();

  return bitcoinAddress;
};

const createTransaction = async function(utxos, outputs, isKMD) {
  const ledger = await getDevice();

  const inputs = await Promise.all(utxos.map(async utxo => {
    const transactionHex = utxo.rawtx;
    const isSegwitSupported = undefined;
    const hasTimestamp = undefined;
    const hasExtraData = true;
    const additionals = ['sapling'];
    const tx = await ledger.splitTransaction(
      transactionHex,
      isSegwitSupported,
      hasTimestamp,
      hasExtraData,
      additionals
    );
    return [tx, utxo.vout];
  }));
  const associatedKeysets = utxos.map(utxo => utxo.derivationPath);
  const changePath = outputs.length === 2 ? outputs[1].derivationPath : undefined;
  const outputScript = buildOutputScript(outputs);
  const unixtime = Math.floor(Date.now() / 1000);
  const lockTime = isKMD ? unixtime - 777 : 0;
  const sigHashType = undefined;
  const segwit = undefined;
  const initialTimestamp = undefined;
  const additionals = ['sapling'];
  const expiryHeight = Buffer.from([0x00, 0x00, 0x00, 0x00]);

  const transaction = await ledger.createPaymentTransactionNew(
    inputs,
    associatedKeysets,
    changePath,
    outputScript,
    lockTime,
    sigHashType,
    segwit,
    initialTimestamp,
    additionals,
    expiryHeight
  );

  await ledger.close();

  return transaction;
};

const getXpub = async derivationPath => {
  const ledger = await getDevice();
  const {publicKey, chainCode} = await ledger.getWalletPublicKey(derivationPath);
  const pathArray = bip32Path.fromString(derivationPath).toPathArray();
  const depth = pathArray.length;
  const childNumber = ((0x80000000 | pathArray.pop()) >>> 0);
  const xpub = createXpub({
    depth,
    childNumber,
    publicKey,
    chainCode,
  });
  
  await ledger.close();
  
  return xpub;
};

module.exports = {
  getDevice,
  isAvailable,
  getAddress,
  createTransaction,
  getXpub,
  setLedgerFWVersion,
  getLedgerFWVersion,
  setLedgerTransport,
  resetTransport,
  transportOptions: transport,
};