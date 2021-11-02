'user strickt'

var express = require('express');
var DriveController = require('../controllers/googleDriveController');
var api = express.Router();

api.post('/saveImage', DriveController.uploadImage);
/* api.get('/perPerson/:id/:field', EmployeeController.getFieldByEmployeeId);
api.post('/perPerson', EmployeeController.saveEmployee);
api.post('/perPerson/batch', EmployeeController.saveEmployeesBatch);
api.put('/perPerson/:id', EmployeeController.updateEmployee);
api.delete('/perPerson/:id', EmployeeController.deleteEmployee); */

module.exports = api;