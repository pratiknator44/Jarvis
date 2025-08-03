
const express = require('express');
const cors = require('cors');
const app = express();
const queryRoutes = require('./routes/query.route'); // Import the query route
const textSpeechRoute = require('./routes/speech-text.route'); // Import the speech-to-text route
const textExtractor = require('./routes/text-extract.route'); // Import the speech-to-text route

// const multerStorage = require('./services/multer-config'); // Import the multer storage configuration

app.use(cors());

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing x-www-form-urlencoded



app.use('/query', queryRoutes);
app.use('/speech-text', textSpeechRoute); // Import the speech-to-text route
app.use('/text-extract',  textExtractor)
// Add more routes here
// app.use('/api/something', require('./routes/something'));

module.exports = app;
