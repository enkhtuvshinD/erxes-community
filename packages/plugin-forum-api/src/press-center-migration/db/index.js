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
let _Customers;
let _Companies;
let _ClientPortalUsers;
let _ForumPermissionGroupUsers;
let _Categories;
let _Posts;

async function connect() {
    await client.connect();
    db = client.db(dbName);
    _Tags = db.collection("tags");
    _Customers = db.collection("customers");
    _Companies = db.collection("companies");
    _ClientPortalUsers = db.collection("client_portal_users");
    _ForumPermissionGroupUsers = db.collection("forum_permission_group_users");
    _Categories = db.collection("forum_categories");
    _Posts = db.collection("forum_posts");
}

async function disconnect() {
    await client.close();
}

function Tags() {
    return _Tags;
}

function Customers() {
    return _Customers;
}

function Companies() {
    return _Companies;
}

function ClientPortalUsers() {
    return _ClientPortalUsers;
}

function ForumPermissionGroupUsers() {
    return _ForumPermissionGroupUsers;
}

function Categories() {
    return _Categories;
}

function Posts() {
    return _Posts;
}

module.exports = {
    connect,
    disconnect,
    Tags,
    Customers,
    Companies,
    ClientPortalUsers,
    ForumPermissionGroupUsers,
    Categories,
    Posts
}