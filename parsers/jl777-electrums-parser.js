/*
 *  Usage: clone https://github.com/jl777/coins
 */

const fs = require('fs');

fs.readdir('./electrums', (err, items) => {
  let servers = {};

  for (let i = 0; i < items.length; i++) {
    servers[items[i].toLowerCase()] = [];
    
    try {
      let contents = JSON.parse(fs.readFileSync(`./electrums/${items[i]}`, 'utf8'));

      for (let j = 0; j < contents.length; j++) {
        servers[items[i].toLowerCase()].push(`${Object.keys(contents[j])[0]}:${contents[j][Object.keys(contents[j])[0]]}:tcp`);
      }
    } catch (e) {
      console.log(`unable to parse ${items[i]}`);
    }
  }

  fs.writeFileSync(`jl777-parsed-electrums.json`, JSON.stringify(servers));
  
  console.log('done');
});