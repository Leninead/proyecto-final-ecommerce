// dao/mongoDB.js
const mongoose = require('mongoose');
require('dotenv').config();

const { MONGO_DB_URI } = process.env;

mongoose.connect(MONGO_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB!');
});

module.exports = mongoose;
