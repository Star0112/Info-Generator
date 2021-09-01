const fs = require('fs');
const xlsxFile = require('read-excel-file/node')
const pinataData = require('./json_src/pinata.json');

function shuffle(array) {
    var currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

async function main() {
    const totalData = [];
    const shuffleData = [];
    const jsonResultDir = './json_results';
    if (!fs.existsSync(jsonResultDir)) {
        fs.mkdirSync(jsonResultDir);
    }

    const metaData = await xlsxFile('./Metadata.xlsx');
    const keyData = metaData[0];

    console.log("metaData: ", metaData.length);
    console.log("pinataData: ", pinataData.length);

    console.log(keyData)

    for (let i = 0; i < 10080; i = i + 1) {
        const data = {};
        const attributes = [];
        const { id, hash } = pinataData[i];

        // Pinata checking
        // if (id - 1 !== i) {
        //     console.log(pinataData[i])
        //     break;
        // }

        for (let j = 0; j < keyData.length; j = j + 1) {
            keyData[j] !== "Punk ID" && metaData[i + 1][j] !== "Nil" && attributes.push({
                "trait_type": keyData[j],
                "value": metaData[i + 1][j]
            })
        }

        data['attributes'] = attributes;
        data['description'] = 'PunkCows is a collection of 40×40 pixel art images enlarged to 500 x 500 randomly generated NFTs grazing on the Ethereum blockchain. The collection is limited to 10,080, and each country has a unique herd of punk cows. There are also super-rare cows in the form of upside-down cows and single PunkCow herds!.';
        data['image'] = `https://ipfs.io/ipfs/${hash}`;
        data['external_url'] = 'https://punkcows.com';
        data['name'] = `PunkCows #${i}`;

        totalData.push(data);
    }

    shuffle(totalData);
    for (let i = 0; i < totalData.length; i = i + 1) {
        const data = {};

        data['attributes'] = totalData[i]['attributes'];
        data['description'] = totalData[i]['description']
        data['image'] = totalData[i]['image'];
        data['external_url'] = totalData[i]['external_url'];
        data['name'] = `PunkCows #${i}`;

        await fs.writeFileSync(`./json_results/${i}.json`, JSON.stringify(data));
        shuffleData.push(data);
    }

    await fs.writeFileSync(`./json_results/_AllProperties.json`, JSON.stringify(shuffleData));
    console.log("Completed!!!")
}

main();