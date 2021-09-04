var ExifImage = require('exif').ExifImage;
const { google } = require('googleapis');
const express = require('express')
const { v4: uuidv4 } = require('uuid');
const app = express()
const port = process.env.PORT || 3000;
const path = require('path');
const fs = require('fs');

const CLIENT_ID = '284726228926-ues614r31hadu26cg1hp71rk3qahrq3o.apps.googleusercontent.com';
const CLIENT_SECRET = 'WOf6wH29xWfryh98k3us6jzN';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

const REFRESH_TOKEN = '1//04Kmw6JLlmp_OCgYIARAAGAQSNwF-L9IrkocVCiDn8bBdow6D0JRO0IEU_n791ujt0G2bZjhttLIBvsxjmZe6HW8yjBNG1siPXow';

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );

  oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  const drive = google.drive({
    version: 'v3',
    auth: oauth2Client,
  });

const filePath = path.join(__dirname, 'myImage.JPG');

const { MongoClient } = require('mongodb');
const url = "mongodb+srv://MainUser:MainUser@maincluster.hqtil.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(url);
var fileId = '';
var fileLinks = '';

async function uploadFile() {
    try {
      const response = await drive.files.create({
        requestBody: {
          name: 'myImage.JPG',
          mimeType: 'image/jpg',
        },
        media: {
          mimeType: 'image/jpg',
          body: fs.createReadStream(filePath),
        },
      });
  
      console.log(response.data);
      fileId = response.data.id;
      await generatePublicUrl(response.data.id);
    } catch (error) {
      console.log(error.message);
    }
  }

  async function deleteFile() {
    try {
      const response = await drive.files.delete({
        fileId: '',
      });
      console.log(response.data, response.status);
    } catch (error) {
      console.log(error.message);
    }
  }

  async function generatePublicUrl(id) {
    try {
      const fileId = id;
      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
  
      /* 
      webViewLink: View the file in browser
      webContentLink: Direct download link 
      */
      const result = await drive.files.get({
        fileId: fileId,
        fields: 'webViewLink, webContentLink',
      });
      fileLinks = result.data;
      console.log(result.data);
    } catch (error) {
      console.log(error.message);
    }
  }

app.get('/', async (req, res) => {
    try {
        await uploadFile();
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
            "InsertionDateTime: " : today.toISOString(),
            "FileId" : fileId,
            "FileLinks" : fileLinks}
            
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