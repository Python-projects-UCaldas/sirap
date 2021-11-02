'use strict'

class GpsData {
    constructor(polygonId, gPSInfo, dateTimeOriginal, insertionDateTime, fileId, fileLinks) {
        this.polygonId = polygonId;
        this.gPSInfo = gPSInfo;
        this.dateTimeOriginal = dateTimeOriginal;
        this.insertionDateTime = insertionDateTime;
        this.fileId = fileId;
        this.fileLinks = fileLinks;
    }
}

module.exports = {
    GpsData
}