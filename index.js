'use strict'

const port = process.env.PORT || 3000;
const app = require('./app');

/* const Drive = require(''); */

  app.listen(port, () => {
      console.log(`API REST running on: ${port}`)
  });