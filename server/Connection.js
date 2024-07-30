require('dotenv').config({ path: '../.env' }); // Adjust the path to the root .env file

const { MongoClient } = require('mongodb');

const url = process.env.MONGODB_URL;

const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectAtlas() {
  await client.connect();
}

module.exports = {
  connectAtlas,
  client
};
