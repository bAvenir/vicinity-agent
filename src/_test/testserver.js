const express = require('express');
let app = express();
let bodyParser = require('body-parser')
// parse various different custom JSON types as JSON
const routerAdmin = require('../_api/routes');
const routerAgent = require('../_agent/_api/routes');
const node_environment = process.env.NODE_ENV;
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use('/admin', routerAdmin);
app.use('/agent', routerAgent);
let server = app.listen(4000, function () {
  let port = server.address().port;
  console.log('Test server listening at port %s', port);
  console.log('App running on ' + node_environment + ' mode');
});
module.exports = server;
