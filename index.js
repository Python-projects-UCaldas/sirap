var ExifImage = require('exif').ExifImage;
const express = require('express')
const { v4: uuidv4 } = require('uuid');
const app = express()
const port = process.env.PORT || 3000;

const { MongoClient } = require('mongodb');
const url = "mongodb+srv://MainUser:MainUser@maincluster.hqtil.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(url);

app.get('/', async (req, res) => {
    try {
        new ExifImage({ image : './myImage.JPG' }, function (error, exifData) {
            if (error)
                console.log('Error: '+error.message);
            else{ 
            //console.log(Buffer.from("lucas").toString('base64'))
            //console.log(Buffer.from(Buffer.from("lucas").toString('base64'), 'base64').toString('ascii'))
            let today = new Date();
            today.setHours(today.getHours() - 5);
            let gpsData = {"Id": uuidv4(), 
            "polygonId" : Buffer.from("lucas").toString('base64'),
            "GPSInfo" : exifData.gps, 
            "DateTimeOriginal: " : exifData.exif.DateTimeOriginal,
            "InsertionDateTime: " : today.toISOString()}
            client.connect(async err => {
                const collection = client.db("collected_database").collection("gpsInfo");
                const save = await collection.insertOne(gpsData);
              });
            res.send(gpsData)
            console.log(exifData)
            }

            
        });
    } catch (error) {
        console.log('Error: ' + error.message);
    } finally {
        await client.close();
    } 
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})