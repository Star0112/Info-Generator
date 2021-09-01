const fs = require('fs');
const pinataData = require('./json_src/pinata.json');
// const traitData = require('./json_src/info_minimum.json');
const traitData = require('./json_src/info.json');

async function main() {
  const totalData = [];
  const jsonResultDir = './json_results';
  if (!fs.existsSync(jsonResultDir)) {
    fs.mkdirSync(jsonResultDir);
  }

  console.log("traitData: ", traitData.length);
  console.log("pinataData: ", pinataData.length);

  if (traitData.length !== pinataData.length) return;

  for (let i = 0; i < 10000; i = i + 1) {
    const data = {};
    const attributes = [];
    const { id, hash } = pinataData[i];
    // Pinata checking
    // if (id !== i) {
    //   console.log(pinataData[i])
    //   break;
    // }
    Object.keys(traitData[id]).map(key => {
      key !== "name" && traitData[id][key] !== "None" && attributes.push({
        "trait_type": key,
        "value": traitData[id][key]
      })
    })
    data['attributes'] = attributes;
    data['description'] = 'PixelMoji is a collection of 1000 procedurally generated collectible NFTs! PixelMojis are the most stylish and expressive NFT\'s on the Ethereum Blockchain. Each PixelMoji can be found with different eyewear, jewlery, along with thousands of possible expressions, however; no PixelMoji is ever the same. How will YOUR PixelMoji express itself?';
    data['image'] = `https://ipfs.io/ipfs/${hash}`;
    data['external_url'] = 'https://pixelmoji.io';
    data['name'] = `PixelMoji #${i}`;

    await fs.writeFileSync(`./json_results/${i}.json`, JSON.stringify(data));
    totalData.push(data);
  }

  await fs.writeFileSync(`./json_results/_AllProperties.json`, JSON.stringify(totalData));
  console.log("Completed!!!")
}

main();