/* Drive Librarys */

const { google } = require('googleapis');
const fs = require('fs');
const uploadMiddleware = require('../middlewares/upload');
const environment = require('../environments/environments');
const database = require('./database');

/* Connection Data */
const CLIENT_ID = environment.CLIENT_ID;
const CLIENT_SECRET = environment.CLIENT_SECRET;
const REDIRECT_URI = environment.REDIRECT_URI;
const REFRESH_TOKEN = environment.REFRESH_TOKEN;

/* Authentication Methods */
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

/* API Methods */
var fileId = '';
var fileLinks = '';

const uploadImage = async (req, res) => {
    uploadMiddleware(req, res, async function(err) {
        if (err) {
            res.send(err);
        } else {
            if (req.file == undefined) {
                res.send('Error: No File Selected!');
            } else {
                let imageName = req.file.filename;     
                await uploadDrive(imageName);
                await database.saveData(imageName, fileId, fileLinks);
            }
        }
        res.send('File Uploaded!');
    });
}

async function uploadDrive (imageName) {
    try {
      const response = await drive.files.create({
        requestBody: {
          name: imageName,
          mimeType: 'image/jpg',
        },
        media: {
          mimeType: 'image/jpg',
          body: fs.createReadStream('./public/' + imageName),
        },
      });
      fileId = response.data.id;
      await generatePublicUrl(response.data.id);
    } catch (error) {
      console.log(error.message);
    }
}

async function generatePublicUrl(id) {
    try {
      let imageId = id;
      await drive.permissions.create({
        fileId: imageId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
  
async function getImage () {
  try {
    const response = await drive.files.get({
      fileId: id,
    });
    fileLinks = response.data.webContentLink;
  }catch (error) {
    console.log(error.message);
  }
}
await getImage();
/* 
webViewLink: View the file in browser
webContentLink: Direct download link 
*/
const result = await drive.files.get({
        fileId: fileId,
        fields: 'webViewLink, webContentLink',
      });
      fileLinks = result.data;
    } catch (error) {
      console.log(error.message);
    }
}

const deleteFileFromDrive = async (id) => {
  try {
    const response = await drive.files.delete({
      fileId: id,
    });
    console.log(response.data, response.status);
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
    uploadImage
};