const Random = require('meteor-random');
const dotenv = require('dotenv');
dotenv.config();
const { connect, disconnect, Tags } = require ('./db/index.js');

const { MIG_DATA_DIR } = process.env;


async function main() {
    await connect();

    console.log({ Tags });

    const tags = await Tags().find({}).toArray();

    console.log(tags);

    await disconnect();
}

main();