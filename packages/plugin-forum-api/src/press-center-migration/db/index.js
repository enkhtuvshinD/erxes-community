const dotenv = require("dotenv");

dotenv.config();
const { MONGO_URL } = process.env;

if (!MONGO_URL) {
    throw new Error(`Environment variable MONGO_URL not set.`);
  }
  

const { MongoClient } = require("mongodb");

const client = new MongoClient(MONGO_URL, { useUnifiedTopology: true });
const dbName = "erxes";

let db;
let _Tags;

async function connect() {
    await client.connect();
    db = client.db(dbName);
    _Tags = db.collection("tags");
}

async function disconnect() {
    await client.close();
}

function Tags() {
    return _Tags;
}

module.exports = {
    connect,
    disconnect,
    Tags,
}