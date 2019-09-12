// https://github.com/request/request/tree/master/tests

import test from 'tape';
import fs from 'fs';
import {
  bip39Search,
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
  btcToEthKeys,
  seedToPriv,
  multisig,
  pubToElectrumScriptHashHex,
  getAddressVersion,
  pubToPub,
  isPrivKey,
} from '../keys';
import networks from '../bitcoinjs-networks';
const fixture = JSON.parse(fs.readFileSync(__dirname + '/fixtures/keys.json'));

test('src - addressVersionCheck', async (t) => {  
  const version = addressVersionCheck(networks.btc, 'RDbGxL8QYdEp8sMULaVZS2E6XThcTKT9Jd');
  
  t.plan(4);
  t.equal(addressVersionCheck(networks.btc, '123'), 'Invalid pub address', 'should return "Invalid pub address"');
  t.equal(addressVersionCheck(networks.btc, 'RDbGxL8QYdEp8sMULaVZS2E6XThcTKT9Jd'), false, 'should invalidate RDbGxL8QYdEp8sMULaVZS2E6XThcTKT9Jd as BTC address');
  t.equal(addressVersionCheck(networks.kmd, 'RDbGxL8QYdEp8sMULaVZS2E6XThcTKT9Jd'), true, 'should validate RDbGxL8QYdEp8sMULaVZS2E6XThcTKT9Jd as KMD address');
  t.equal(addressVersionCheck(networks.btc, '15K5spF7woSF4rzGsQWSLVttmCF1nGGDXe'), true, 'should validate 15K5spF7woSF4rzGsQWSLVttmCF1nGGDXe as KMD address');
});

test('src - bip39Search', async (t) => {
  const allallall = 'all all all all all all all all all all all all';
  const search = {
    KMD_default: bip39Search(allallall, networks.kmd),
    BTC_default: bip39Search(allallall, networks.btc),
    KMD_pattern_no_match: bip39Search(allallall, networks.kmd, { address: 'RDbGxL8QYdEp8sMULaVZS2E6XThcTKT9Jd' }),
    KMD_pattern_match: bip39Search(allallall, networks.kmd, { address: 'R9HgJZo6JBKmPvhm7whLSR8wiHyZrEDVRi' }),
    KMD_account_count: bip39Search(allallall, networks.kmd, { accountsCount: 2 }),
    KMD_address_depth: bip39Search(allallall, networks.kmd, { addressDepth: 2 }),
    KMD_account_count_offset: bip39Search(allallall, networks.kmd, { accountCountOffset: 1 }),
    KMD_address_depth_offset: bip39Search(allallall, networks.kmd, { addressDepthOffset: 1 }),
    KMD_all_options: bip39Search(allallall, networks.kmd, {
      accountsCount: 2,
      addressDepth: 2,
      accountCountOffset: 1,
      addressDepthOffset: 1,
    }),
  };
  
  t.plan(9);
  t.deepEqual(search.KMD_default, fixture.bip39Search.KMD_array, 'should return KMD array with 1 element');
  t.deepEqual(search.BTC_default, fixture.bip39Search.BTC_array, 'should return BTC array with 1 element');
  t.deepEqual(search.KMD_pattern_no_match, {}, 'should return an empty object');
  t.deepEqual(search.KMD_pattern_match, fixture.bip39Search.KMD_array[0], 'should find a KMD address (obj)');
  t.deepEqual(search.KMD_account_count, fixture.bip39Search.KMD_account_count, 'should return KMD array with 2 addresses (accounts count)');
  t.deepEqual(search.KMD_address_depth, fixture.bip39Search.KMD_address_depth, 'should return KMD array with 2 addresses (address depth)');
  t.deepEqual(search.KMD_account_count_offset, fixture.bip39Search.KMD_account_count_offset, 'should return KMD array with 1 address (account count offset)');
  t.deepEqual(search.KMD_address_depth_offset, fixture.bip39Search.KMD_address_depth_offset, 'should return KMD array with 1 address (address depth offset)');
  t.deepEqual(search.KMD_all_options, fixture.bip39Search.KMD_all_options, 'should return KMD array with 4 address (all options apllied)');
});

test('src - wifToWif', async (t) => {  
  t.plan(6);
  t.throws(() => wifToWif('123', networks.btc), /Invalid checksum/, 'should throw "Invalid checksum"');
  t.throws(() => wifToWif('RDbGxL8QYdEp8sMULaVZS2E6XThcTKT9Jd', networks.btc), /Invalid WIF length/, 'should throw "Invalid WIF length"');
  t.deepEqual(wifToWif('Uu831oyJFDQ1BsQuucH1TG3CbD2YHmvXrwnFLeAi7f9PKxcmGri3', networks.btc), fixture.wifToWif.KMDtoBTC, 'should convert KMD WIF to BTC keys');
  t.deepEqual(wifToWif('L2LCi8MKjzRkipcpj4bRgpMyf8yQCfev6SQRmPP2ewvgS6fGEbMb', networks.kmd), fixture.wifToWif.BTCtoKMD, 'should convert BTC WIF to KMD keys');
  t.deepEqual(wifToWif('Uu831oyJFDQ1BsQuucH1TG3CbD2YHmvXrwnFLeAi7f9PKxcmGri3', networks.grs), fixture.wifToWif.KMDtoGRS, 'should convert KMD WIF to GRS keys');
  t.deepEqual(wifToWif('Uu831oyJFDQ1BsQuucH1TG3CbD2YHmvXrwnFLeAi7f9PKxcmGri3', networks.zec), fixture.wifToWif.KMDtoZEC, 'should convert KMD WIF to ZEC keys');
});

test('src - seedToWif', async (t) => {  
  t.plan(10);
  t.deepEqual(stringToWif('RRyBxbrAPRUBCUpiJgJZYrkxqrh8x5ta9Z', networks.kmd), fixture.stringToWif.KMD_pub_address, 'should return watchonly (type=pub) obj');
  t.deepEqual(stringToWif('L2LCi8MKjzRkipcpj4bRgpMyf8yQCfev6SQRmPP2ewvgS6fGEbMb', networks.kmd), fixture.stringToWif.BTC_WIF_to_KMD_WIF, 'should convert BTC WIF to KMD WIF');
  t.deepEqual(stringToWif('test', networks.btc), fixture.stringToWif.BTC, 'should convert a seed to BTC keys');
  t.deepEqual(stringToWif('test', networks.kmd), fixture.stringToWif.KMD, 'should convert a seed to KMD keys');
  t.deepEqual(stringToWif('test', networks.grs), fixture.stringToWif.GRS, 'should convert a seed to GRS keys');
  t.deepEqual(stringToWif('test', networks.zec), fixture.stringToWif.ZEC, 'should convert a seed to ZEC keys');
  t.deepEqual(stringToWif('test', networks.btc, false), fixture.stringToWif.BTC_iguana_incompatible, 'should convert a seed to BTC keys (iguana incompatible)');
  t.deepEqual(stringToWif('test', networks.kmd, false), fixture.stringToWif.KMD_iguana_incompatible, 'should convert a seed to KMD keys (iguana incompatible)');
  t.deepEqual(stringToWif('test', networks.grs, false), fixture.stringToWif.GRS_iguana_incompatible, 'should convert a seed to GRS keys (iguana incompatible)');
  t.deepEqual(stringToWif('test', networks.zec, false), fixture.stringToWif.ZEC_iguana_incompatible, 'should convert a seed to ZEC keys (iguana incompatible)');
});

test('src - pubkeyToAddress', async (t) => {
  const pubkey = '020e0f6fe6e0fcdcac541eb728d6fe538a12adff20412b3c8a7fa892b223a47c2f'; 
  
  t.plan(4);
  t.equal(pubkeyToAddress(pubkey, networks.btc), '1Hgzt5xsnbfc8UTWqWKSTLRm5bEYHYBoCE', 'should return BTC address 1Hgzt5xsnbfc8UTWqWKSTLRm5bEYHYBoCE');
  t.equal(pubkeyToAddress(pubkey, networks.kmd), 'RRyBxbrAPRUBCUpiJgJZYrkxqrh8x5ta9Z', 'should return KMD address RRyBxbrAPRUBCUpiJgJZYrkxqrh8x5ta9Z');
  t.equal(pubkeyToAddress(pubkey, networks.grs), 'FmriKzhFM6M9a5UdicJuurE5jkWVu4eZXp', 'should return GRS address FmriKzhFM6M9a5UdicJuurE5jkWVu4eZXp');
  t.equal(pubkeyToAddress(pubkey, networks.zec), 't1aZbtRP1kvTCj7WQmw8Zb9XgLFRd7rtthy', 'should return ZEC address t1aZbtRP1kvTCj7WQmw8Zb9XgLFRd7rtthy');
});

test('src - etherKeys', async (t) => {
  t.plan(4);
  t.deepEqual(etherKeys('0x9886d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a48', true).signingKey, fixture.etherKeys.signingKeyFromETHPriv, 'should return signingKey object (from priv key)');
  t.deepEqual(etherKeys('test', false).signingKey, fixture.etherKeys.signingKeyFromSeed, 'should return signingKey object (from seed, iguana incompatible)');
  t.deepEqual(etherKeys('test', true).signingKey, fixture.etherKeys.signingKeyFromETHPriv, 'should return signingKey object (from seed, iguana compatible)');
  t.deepEqual(etherKeys('test', true, true), fixture.etherKeys.keyPairOnly, 'should return key pair object (from seed, iguana compatible)');
});

test('src - xpub', async (t) => {
  const seed = 'all all all all all all all all all all all all';

  t.plan(4);
  t.throws(() => xpub('test'), /Missing bip44 property in network params/);
  t.equal(xpub('test', { bip32: true }), 'xpub661MyMwAqRbcFUKi6FHALxxqS1Jtk7ZveU3BcM1Y8NwyUby3zYWJUn5uFsYC1dUTgtYtxUhAHoG1hZLEGuxYJ1tCdJGCXqVbQS3ruUsWXQb', 'should return xpub661MyMwAqRbcFUKi6FHALxxqS1Jtk7ZveU3BcM1Y8NwyUby3zYWJUn5uFsYC1dUTgtYtxUhAHoG1hZLEGuxYJ1tCdJGCXqVbQS3ruUsWXQb');
  t.equal(xpub(seed, { network: networks.kmd }), 'xpub6APRH5kELam2myR7zqquN1g1Ahh9MARJpVYyx5JcQdVzYJJ4vq6izkfmHTrfT2dtsNjYoUDByMM7AhCfRaXMHQewYYsjiang7SRFTZhE9ta', 'should return xpub6APRH5kELam2myR7zqquN1g1Ahh9MARJpVYyx5JcQdVzYJJ4vq6izkfmHTrfT2dtsNjYoUDByMM7AhCfRaXMHQewYYsjiang7SRFTZhE9ta (KMD, m/44\'/141\')');
  t.equal(xpub(seed, { path: `0'/0`, network: networks.kmd }), 'xpub6EJt1ycwS6supXptrrcF9woa387eGx5Cu3DvpgRuZi837PPWYf49DpsZbgWcgifGnCTbhEZbgk4bADmuYAzoZ2FMhBWZu1fpq4cqKWBnHvJ', 'should return xpub6EJt1ycwS6supXptrrcF9woa387eGx5Cu3DvpgRuZi837PPWYf49DpsZbgWcgifGnCTbhEZbgk4bADmuYAzoZ2FMhBWZu1fpq4cqKWBnHvJ (KMD, m/44\'/141\'/0\'/0)');
});

test('src - btcToEthPriv', async (t) => {  
  t.plan(4);
  t.throws(() => btcToEthPriv('123'), /Invalid checksum/, 'should throw "Invalid checksum"');
  t.throws(() => btcToEthPriv('RDbGxL8QYdEp8sMULaVZS2E6XThcTKT9Jd'), /Invalid WIF length/, 'should throw "Invalid WIF length"');
  t.equal(btcToEthPriv('L2LCi8MKjzRkipcpj4bRgpMyf8yQCfev6SQRmPP2ewvgS6fGEbMb'), '0x9886d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a48', 'should convert BTC WIF to ETH priv');
  t.equal(btcToEthPriv('Uu831oyJFDQ1BsQuucH1TG3CbD2YHmvXrwnFLeAi7f9PKxcmGri3'), '0x9886d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a48', 'should convert KMD WIF to ETH priv');
});

test('src - ethToBtcWif', async (t) => {  
  t.plan(1);
  t.equal(ethToBtcWif('0x9886d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a48'), 'L2LCi8MKjzRkipcpj4bRgpMyf8yQCfev6SQRmPP2ewvgS6fGEbMb', 'should convert ETH priv to BTC WIF');
});

test('src - ethPrivToPub', async (t) => {  
  t.plan(1);
  t.equal(ethPrivToPub('0x9886d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a48'), '0xA3628fDa345ADAB6e91384d6fFDf86C120771530', 'should return 0xA3628fDa345ADAB6e91384d6fFDf86C120771530');
});

test('src - btcToEthKeys', async (t) => {  
  t.plan(4);
  t.throws(() => btcToEthKeys('123'), /Invalid checksum/, 'should throw "Invalid checksum"');
  t.throws(() => btcToEthKeys('RDbGxL8QYdEp8sMULaVZS2E6XThcTKT9Jd'), /Invalid WIF length/, 'should throw "Invalid WIF length"');
  t.deepEqual(btcToEthKeys('L2LCi8MKjzRkipcpj4bRgpMyf8yQCfev6SQRmPP2ewvgS6fGEbMb'), fixture.btcToEthKeys, 'should return key pair object (BTC WIF)');
  t.deepEqual(btcToEthKeys('Uu831oyJFDQ1BsQuucH1TG3CbD2YHmvXrwnFLeAi7f9PKxcmGri3'), fixture.btcToEthKeys, 'should return key pair object (KMD WIF)');
});

test('src - seedToPriv', async (t) => {  
  t.plan(3);
  t.equal(seedToPriv('L2LCi8MKjzRkipcpj4bRgpMyf8yQCfev6SQRmPP2ewvgS6fGEbMb'), '0x9886d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a48', 'should return 0x9886d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a48 (BTC WIF)');
  t.equal(seedToPriv('test'), 'test', 'should return test (seed)');
  t.equal(seedToPriv('0x9886d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a48'), 'L2LCi8MKjzRkipcpj4bRgpMyf8yQCfev6SQRmPP2ewvgS6fGEbMb', 'should return L2LCi8MKjzRkipcpj4bRgpMyf8yQCfev6SQRmPP2ewvgS6fGEbMb (ETH priv)');
});

test('src - pubToElectrumScriptHashHex', async (t) => {  
  t.plan(4);
  t.equal(pubToElectrumScriptHashHex('1Hgzt5xsnbfc8UTWqWKSTLRm5bEYHYBoCE'), '4794d6341f1730a5a4548da02b73b268ce5c99947a3ab2ecc2bf1348f602f93d', 'should return 4794d6341f1730a5a4548da02b73b268ce5c99947a3ab2ecc2bf1348f602f93d (BTC)');
  t.equal(pubToElectrumScriptHashHex('RRyBxbrAPRUBCUpiJgJZYrkxqrh8x5ta9Z', networks.kmd), '4794d6341f1730a5a4548da02b73b268ce5c99947a3ab2ecc2bf1348f602f93d', 'should return 4794d6341f1730a5a4548da02b73b268ce5c99947a3ab2ecc2bf1348f602f93d (KMD)');
  t.equal(pubToElectrumScriptHashHex('FmriKzhFM6M9a5UdicJuurE5jkWVtNdSB9', networks.grs), '4794d6341f1730a5a4548da02b73b268ce5c99947a3ab2ecc2bf1348f602f93d', 'should return 4794d6341f1730a5a4548da02b73b268ce5c99947a3ab2ecc2bf1348f602f93d (GRS)');
  t.equal(pubToElectrumScriptHashHex('t1aZbtRP1kvTCj7WQmw8Zb9XgLFRd7rtthy', networks.zec), '4794d6341f1730a5a4548da02b73b268ce5c99947a3ab2ecc2bf1348f602f93d', 'should return 4794d6341f1730a5a4548da02b73b268ce5c99947a3ab2ecc2bf1348f602f93d (ZEC)');
});

test('src - getAddressVersion', async (t) => {  
  t.plan(9);
  t.throws(() => getAddressVersion('123'), /Invalid pub address or unknown network/, 'should throw "Invalid pub address or unknown network"');
  t.equal(getAddressVersion('1Hgzt5xsnbfc8UTWqWKSTLRm5bEYHYBoCE').version, 0, 'should return version 0 (BTC)');
  t.equal(getAddressVersion('1Hgzt5xsnbfc8UTWqWKSTLRm5bEYHYBoCE').coins.indexOf('btc') > -1, true, 'should return true (BTC)');
  t.equal(getAddressVersion('RRyBxbrAPRUBCUpiJgJZYrkxqrh8x5ta9Z').version, 60, 'should return version 60 (KMD)');
  t.equal(getAddressVersion('RRyBxbrAPRUBCUpiJgJZYrkxqrh8x5ta9Z').coins.indexOf('kmd') > -1, true, 'should return true (KMD)');
  t.equal(getAddressVersion('FmriKzhFM6M9a5UdicJuurE5jkWVtNdSB9').version, 36, 'should return version 36 (GRS)');
  t.equal(getAddressVersion('FmriKzhFM6M9a5UdicJuurE5jkWVtNdSB9').coins.indexOf('grs') > -1, true, 'should return true (GRS)');
  t.equal(getAddressVersion('t1aZbtRP1kvTCj7WQmw8Zb9XgLFRd7rtthy').version, 7352, 'should return version 7352 (ZEC)');
  t.equal(getAddressVersion('t1aZbtRP1kvTCj7WQmw8Zb9XgLFRd7rtthy').coins.indexOf('zec') > -1, true, 'should return true (ZEC)');
});

test('src - pubToPub', async (t) => {  
  t.plan(12);
  t.equal(pubToPub('1Hgzt5xsnbfc8UTWqWKSTLRm5bEYHYBoCE', networks.btc, networks.kmd), 'RRyBxbrAPRUBCUpiJgJZYrkxqrh8x5ta9Z', 'should return RRyBxbrAPRUBCUpiJgJZYrkxqrh8x5ta9Z (BTC to KMD)');
  t.equal(pubToPub('1Hgzt5xsnbfc8UTWqWKSTLRm5bEYHYBoCE', networks.btc, networks.grs), 'FmriKzhFM6M9a5UdicJuurE5jkWVtNdSB9', 'should return FmriKzhFM6M9a5UdicJuurE5jkWVtNdSB9 (BTC to GRS)');
  t.equal(pubToPub('1Hgzt5xsnbfc8UTWqWKSTLRm5bEYHYBoCE', networks.btc, networks.zec), 't1aZbtRP1kvTCj7WQmw8Zb9XgLFRd7rtthy', 'should return t1aZbtRP1kvTCj7WQmw8Zb9XgLFRd7rtthy (BTC to ZEC)');  
  t.equal(pubToPub('RRyBxbrAPRUBCUpiJgJZYrkxqrh8x5ta9Z', networks.kmd, networks.btc), '1Hgzt5xsnbfc8UTWqWKSTLRm5bEYHYBoCE', 'should return 1Hgzt5xsnbfc8UTWqWKSTLRm5bEYHYBoCE (KMD to BTC)');
  t.equal(pubToPub('RRyBxbrAPRUBCUpiJgJZYrkxqrh8x5ta9Z', networks.kmd, networks.grs), 'FmriKzhFM6M9a5UdicJuurE5jkWVtNdSB9', 'should return FmriKzhFM6M9a5UdicJuurE5jkWVtNdSB9 (KMD to GRS)');
  t.equal(pubToPub('RRyBxbrAPRUBCUpiJgJZYrkxqrh8x5ta9Z', networks.kmd, networks.zec), 't1aZbtRP1kvTCj7WQmw8Zb9XgLFRd7rtthy', 'should return t1aZbtRP1kvTCj7WQmw8Zb9XgLFRd7rtthy (KMD to ZEC)');  
  t.equal(pubToPub('FmriKzhFM6M9a5UdicJuurE5jkWVtNdSB9', networks.grs, networks.btc), '1Hgzt5xsnbfc8UTWqWKSTLRm5bEYHYBoCE', 'should return 1Hgzt5xsnbfc8UTWqWKSTLRm5bEYHYBoCE (GRS to BTC)');
  t.equal(pubToPub('FmriKzhFM6M9a5UdicJuurE5jkWVtNdSB9', networks.grs, networks.kmd), 'RRyBxbrAPRUBCUpiJgJZYrkxqrh8x5ta9Z', 'should return RRyBxbrAPRUBCUpiJgJZYrkxqrh8x5ta9Z (GRS to KMD)');
  t.equal(pubToPub('FmriKzhFM6M9a5UdicJuurE5jkWVtNdSB9', networks.grs, networks.zec), 't1aZbtRP1kvTCj7WQmw8Zb9XgLFRd7rtthy', 'should return t1aZbtRP1kvTCj7WQmw8Zb9XgLFRd7rtthy (GRS to ZEC)');  
  t.equal(pubToPub('t1aZbtRP1kvTCj7WQmw8Zb9XgLFRd7rtthy', networks.zec, networks.btc), '1Hgzt5xsnbfc8UTWqWKSTLRm5bEYHYBoCE', 'should return 1Hgzt5xsnbfc8UTWqWKSTLRm5bEYHYBoCE (ZEC to BTC)');
  t.equal(pubToPub('t1aZbtRP1kvTCj7WQmw8Zb9XgLFRd7rtthy', networks.zec, networks.kmd), 'RRyBxbrAPRUBCUpiJgJZYrkxqrh8x5ta9Z', 'should return RRyBxbrAPRUBCUpiJgJZYrkxqrh8x5ta9Z (ZEC to KMD)');
  t.equal(pubToPub('t1aZbtRP1kvTCj7WQmw8Zb9XgLFRd7rtthy', networks.zec, networks.grs), 'FmriKzhFM6M9a5UdicJuurE5jkWVtNdSB9', 'should return FmriKzhFM6M9a5UdicJuurE5jkWVtNdSB9 (ZEC to GRS)');  
});

test('src - pubToPub', async (t) => {  
  t.plan(4);
  t.equal(isPrivKey('0x9886d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a48'), true, 'should return true (ETH priv)');
  t.equal(isPrivKey('L2LCi8MKjzRkipcpj4bRgpMyf8yQCfev6SQRmPP2ewvgS6fGEbMb'), true, 'should return true (BTC WIF)');
  t.equal(isPrivKey('123'), false, 'should return false (123)');
  t.equal(isPrivKey('1Hgzt5xsnbfc8UTWqWKSTLRm5bEYHYBoCE'), false, 'should return false (BTC pub address)');
});

test('src - multisig - generate', async (t) => {
  const pubKeys = [
    stringToWif('test').pubHex,
    stringToWif('test1').pubHex,
    stringToWif('test2').pubHex,
  ];
  const multisigWallet = {
    BTC_1of2: multisig.generate(1, [pubKeys[0], pubKeys[1]], networks.btc),
    BTC_2of2: multisig.generate(2, [pubKeys[0], pubKeys[1]], networks.btc),
    BTC_2of3: multisig.generate(2, [pubKeys[0], pubKeys[1], pubKeys[2]], networks.btc),
    KMD_1of2: multisig.generate(1, [pubKeys[0], pubKeys[1]], networks.kmd),
    KMD_2of2: multisig.generate(2, [pubKeys[0], pubKeys[1]], networks.kmd),
    KMD_2of3: multisig.generate(2, [pubKeys[0], pubKeys[1], pubKeys[2]], networks.kmd),
  };

  t.plan(6);
  t.deepEqual(multisigWallet.BTC_1of2, fixture.generate.BTC_1of2, 'should generate 1 of 2 BTC wallet');
  t.deepEqual(multisigWallet.BTC_2of2, fixture.generate.BTC_2of2, 'should generate 2 of 2 BTC wallet');
  t.deepEqual(multisigWallet.BTC_3of2, fixture.generate.BTC_3of2, 'should generate 3 of 2 BTC wallet');
  t.deepEqual(multisigWallet.KMD_1of2, fixture.generate.KMD_1of2, 'should generate 1 of 2 KMD wallet');
  t.deepEqual(multisigWallet.KMD_2of2, fixture.generate.KMD_2of2, 'should generate 2 of 2 KMD wallet');
  t.deepEqual(multisigWallet.KMD_3of2, fixture.generate.KMD_3of2, 'should generate 3 of 2 KMD wallet');
});

test('src - multisig - scriptPubKeyToPubAddress', async (t) => {
  t.plan(6);
  t.deepEqual(multisig.scriptPubKeyToPubAddress(fixture.generate.BTC_1of2.scriptPubKey), fixture.generate.BTC_1of2.address, 'should generate 1 of 2 BTC wallet pub address');
  t.deepEqual(multisig.scriptPubKeyToPubAddress(fixture.generate.BTC_2of2.scriptPubKey), fixture.generate.BTC_2of2.address, 'should generate 2 of 2 BTC wallet pub address');
  t.deepEqual(multisig.scriptPubKeyToPubAddress(fixture.generate.BTC_2of3.scriptPubKey), fixture.generate.BTC_2of3.address, 'should generate 2 of 3 BTC wallet pub address');
  t.deepEqual(multisig.scriptPubKeyToPubAddress(fixture.generate.KMD_1of2.scriptPubKey, networks.kmd), fixture.generate.KMD_1of2.address, 'should generate 1 of 2 KMD wallet pub address');
  t.deepEqual(multisig.scriptPubKeyToPubAddress(fixture.generate.KMD_2of2.scriptPubKey, networks.kmd), fixture.generate.KMD_2of2.address, 'should generate 2 of 2 KMD wallet pub address');
  t.deepEqual(multisig.scriptPubKeyToPubAddress(fixture.generate.KMD_2of3.scriptPubKey, networks.kmd), fixture.generate.KMD_2of3.address, 'should generate 2 of 3 KMD wallet pub address');
});

test('src - multisig - redeemScriptToPubAddress', async (t) => {
  t.plan(6);
  t.deepEqual(multisig.redeemScriptToPubAddress(fixture.generate.BTC_1of2.redeemScript), fixture.generate.BTC_1of2.address, 'should generate 1 of 2 BTC wallet pub address');
  t.deepEqual(multisig.redeemScriptToPubAddress(fixture.generate.BTC_2of2.redeemScript), fixture.generate.BTC_2of2.address, 'should generate 2 of 2 BTC wallet pub address');
  t.deepEqual(multisig.redeemScriptToPubAddress(fixture.generate.BTC_2of3.redeemScript), fixture.generate.BTC_2of3.address, 'should generate 2 of 3 BTC wallet pub address');
  t.deepEqual(multisig.redeemScriptToPubAddress(fixture.generate.KMD_1of2.redeemScript, networks.kmd), fixture.generate.KMD_1of2.address, 'should generate 1 of 2 KMD wallet pub address');
  t.deepEqual(multisig.redeemScriptToPubAddress(fixture.generate.KMD_2of2.redeemScript, networks.kmd), fixture.generate.KMD_2of2.address, 'should generate 2 of 2 KMD wallet pub address');
  t.deepEqual(multisig.redeemScriptToPubAddress(fixture.generate.KMD_2of3.redeemScript, networks.kmd), fixture.generate.KMD_2of3.address, 'should generate 2 of 3 KMD wallet pub address');
});

test('src - multisig - redeemScriptToScriptPubKey', async (t) => {
  t.plan(6);
  t.deepEqual(multisig.redeemScriptToScriptPubKey(fixture.generate.BTC_1of2.redeemScript), fixture.generate.BTC_1of2.scriptPubKey, 'should generate 1 of 2 BTC wallet pub hex');
  t.deepEqual(multisig.redeemScriptToScriptPubKey(fixture.generate.BTC_2of2.redeemScript), fixture.generate.BTC_2of2.scriptPubKey, 'should generate 2 of 2 BTC wallet pub hex');
  t.deepEqual(multisig.redeemScriptToScriptPubKey(fixture.generate.BTC_2of3.redeemScript), fixture.generate.BTC_2of3.scriptPubKey, 'should generate 2 of 3 BTC wallet pub hex');
  t.deepEqual(multisig.redeemScriptToScriptPubKey(fixture.generate.KMD_1of2.redeemScript, networks.kmd), fixture.generate.KMD_1of2.scriptPubKey, 'should generate 1 of 2 KMD wallet pub hex');
  t.deepEqual(multisig.redeemScriptToScriptPubKey(fixture.generate.KMD_2of2.redeemScript, networks.kmd), fixture.generate.KMD_2of2.scriptPubKey, 'should generate 2 of 2 KMD wallet pub hex');
  t.deepEqual(multisig.redeemScriptToScriptPubKey(fixture.generate.KMD_2of3.redeemScript, networks.kmd), fixture.generate.KMD_2of3.scriptPubKey, 'should generate 2 of 3 KMD wallet pub hex');
});