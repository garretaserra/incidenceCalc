// Import libraries
import express = require('express');
import bodyParser = require('body-parser');
import cors = require('cors');
import errorHandler = require('errorhandler');

// Import routes
import incidenceRoute from '././routes/incidenceRoutes';

// Server variable initialization
let app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(errorHandler());

app.use('/', incidenceRoute);


// Make app listen on port 3000
app.listen(3000);
console.log('Server listening on port 3000');
module.exports = app;
