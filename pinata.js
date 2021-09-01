require('dotenv').config();
const fs = require('fs');

const pinataSDK = require('@pinata/sdk');
const apiKey = process.env.PINATA_API_KEY;
const secretKey = process.env.PINATA_API_SECRET;
const startIndex = parseInt(process.env.START_INDEX, 10);
const endIndex = parseInt(process.env.END_INDEX, 10);

const pinata = pinataSDK(apiKey, secretKey);

let pinataData = require('./pinata.json');

async function pinList() {
    const metadataFilter = {};

    const filters = {
        status: 'pinned',
        pageLimit: 1,
        pageOffset: 0,
        metadata: metadataFilter
    };
    const result = await pinata.pinList(filters);
    console.log(result)
}

async function pin(id) {
    const sourcePath = `./images/${id}.png`;
    const options = {};
    try {
        const result = await pinata.pinFromFS(sourcePath, options);
        console.log(`Uploaded file ${id} to pinata. Ipfs Hash - ${result.IpfsHash}`);

        pinataData.push({
            id: id,
            hash: result.IpfsHash
        })
    } catch (err) {
        fs.writeFile(`pinata.json`, JSON.stringify(pinataData), function (err) {
            if (err) throw err;
        });
        console.log(err);
    }
}

async function main() {
    const startTime = Date.now();
    console.log(`Upload started. ${startTime}`);
    for (let i = parseInt(startIndex, 10); i <= parseInt(endIndex, 10); i++) {
        await pin(i);
    }

    console.log(`Upload ended. ${Date.now()}`);
    console.log(`Elapsed time. ${Date.now() - startTime}`);

    fs.writeFile(`pinata.json`, JSON.stringify(pinataData), function (err) {
        if (err) throw err;
    });

    await new Promise((res) => {
        setTimeout(() => {
            console.log('Finished');
            res();
        }, 3000)
    });

    // pinList();
    // console.log(pinataData.length)
}

main();
