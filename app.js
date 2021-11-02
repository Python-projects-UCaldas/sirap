'use strict'

const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

let driveRoutes = require('./routes/driveRoutes');
/* 
var eventRoutes = require('./routes/event') */

/* app.use('/api/v1', );
app.use('/api/v1', ); */
app.use('/api/v1', driveRoutes);
app.use('/', (req, res) => {
    res.status(200).send({ message: `API v1 is OnLine` })
})

module.exports = app;