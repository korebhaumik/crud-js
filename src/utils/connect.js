const mongoose = require("mongoose");

require('dotenv').config()

const uri = process.env.MONGO_URI;

async function connectToDb() {
  try {
    await mongoose.connect(uri, { dbName: process.env.DB_NAME });
    console.log("Connected to mongoDB...");
  } catch (err) {
    throw {
      message: err.message,
      ok: err.ok,
      code: err.code,
      codeName: err.codeName,
    };
  }
}

module.exports = connectToDb;
