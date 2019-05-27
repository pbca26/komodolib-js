/*
 *  Usage: run electrum-servers-parser --local --parse
 *         agruments are optional to convert to human readable JSON or back to stringified JSON
 */

const _servers = require('../src/electrum-servers');
const fs = require('fs');
const fname = './servers.json';

let servers = {};
let flags = {};

const format = (data) => {  
  if (flags.parse) {
    data = JSON.stringify(data)
    .replace(/,/g, ',\n') // format json in human readable form
    .replace(/":/g, '": ')
    .replace(/\"/g, '"')
    .replace(/\\/g, '')
    .replace('"{', '{\n')
    .replace('}"', '\n}')
    .replace(/\[/g, '[\n')
    .replace(/\]/g, '\n]');
  } else {
    data = JSON.stringify(JSON.parse(data));
  }

  return data;
};

process.argv.forEach((val, index) => {  
  if (index > 1) {
    console.log(val);
    
    if (val.indexOf('--parse') > -1) {
      flags.parse = true;
    }

    if (val.indexOf('--local') > -1) {
      flags.local = true;
    }
  }
});

for (let key in _servers) {
  servers[key] = _servers[key].serverList;
}

if (flags.local) {
  let localFile = fs.readFileSync(fname, 'utf8');

  fs.writeFile(fname, format(localFile), 'utf8', (err) => {
    if (err) console.log(`error: ${e}`);
  });

  console.log(`done, flags ${Object.keys(flags).join('  ')}`);
}

if (!Object.keys(flags).length) {
  fs.writeFile(fname, format(servers), 'utf8', (err) => {
    if (err) console.log(`error: ${e}`);
  });

  console.log(`${Object.keys(servers).length} servers saved to servers.json`);
}