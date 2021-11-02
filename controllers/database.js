"use strict";

const environment = require("../environments/environments");
const metadata = require("../middlewares/metaData");
const { v4: uuidv4 } = require("uuid");
const fs = require('fs');

const { MongoClient } = require("mongodb");
const url = environment.MONGO_URI;
const client = new MongoClient(url);
let pathImage = "./public/";

const saveData = async (imageName, fileId, fileLinks) => {
  let today = new Date();
  today.setHours(today.getHours() - 5);
  try {
    let metaData = await metadata.extractMetaData(pathImage + imageName);
    let gpsData = {
      Id: uuidv4(),
      polygonId: Buffer.from(imageName).toString("base64"),
      GPSInfo: metaData.gps,
      DateTimeOriginal: metaData.exif.DateTimeOriginal,
      InsertionDateTime: today.toISOString(),
      FileId: fileId,
      FileLinks: fileLinks,
    };

    client.connect(async (err) => {
      const collection = client.db("collected_database").collection("gpsInfo");
      const save = await collection.insertOne(gpsData);
    });
  } catch (error) {
    console.log("Error: " + error.message);
  } finally {
    await client.close();
    try {
        fs.unlink(pathImage + imageName, (err) => {
            if (err) throw err;
            console.log('successfully deleted ' + pathImage + imageName);
        });
  } catch (error) {
      console.log('Error: ' + error.message);
  }
  }
};

module.exports = {
  saveData,
};
