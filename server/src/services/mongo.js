const mongoose = require('mongoose');

require('dotenv').config();

mongoose.connection.once('open', () => {
  console.log('mongoose connection ready');
});

mongoose.connection.on('error', (err) => {
  console.log(err);
});

const mongo_uri = process.env.MONGO_URI;

async function mongoConnect() {
  await mongoose.connect(mongo_uri);
}

module.exports = mongoConnect;
