const fs = require('fs');

const fname = [
  'jl777-parsed-electrums.json',
  'agama-wallet-lib.json',
];

let out = {};

for (let i = 0; i < fname.length; i++) {
  try {
    const localFile = JSON.parse(fs.readFileSync(`./${fname[i]}`, 'utf8'));

    for (let key in localFile) {
      for (let j = 0; j < localFile[key].length; j++) {
        if (!out[key.toLowerCase()]) {
          out[key.toLowerCase()] = [];
        }

        if (out[key.toLowerCase()].indexOf(localFile[key][j]) > -1) {
          console.log(`${key.toLowerCase()} duplicate server ${localFile[key][j]}`);
        } else {
          out[key.toLowerCase()].push(localFile[key][j]);
          console.log(`${key.toLowerCase()} new server ${localFile[key][j]}`);
        }
      }
    }
  } catch (e) {
    console.log(`unable to read ${fname[i]}`)
  }
}

fs.writeFileSync('./merge.json', JSON.stringify(out));

console.log('done')