const Random = require('meteor-random');
const dotenv = require('dotenv');
dotenv.config();
const { connect, disconnect, Tags } = require ('./db/index.js');
const randomColorCode = require('./randomColorCode');

const { MIG_DATA_DIR } = process.env;


async function main() {
    await connect();

    const tags = await Tags().find({}).toArray();

    console.log(tags);

    console.log(randomColorCode());

    await disconnect();
}

main();