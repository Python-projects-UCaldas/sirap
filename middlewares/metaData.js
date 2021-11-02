'use strict'

const ExifImage = require('exif').ExifImage;

const extractMetaData = (pathImage) => {
    return new Promise((resolve, reject) => {
        try {
            new ExifImage({ image: pathImage }, (error, exifData) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(exifData);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    extractMetaData
};