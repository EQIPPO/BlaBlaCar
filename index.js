require('dotenv').config();

// Database connection
const db_backend = process.env.DATABASE_BACKEND;
const db_connection = process.env.DATABASE_CONNECTION_STRING;

const backend = require(`./api/database/backends/${db_backend}`)(db_connection);
const database = require('./api/database')(backend);

// Express
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Parse request body
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware
const api = require('./api')(database);

app.use('/api', api);
app.use(express.static('www'));

app.listen(port, () => {
    console.log(`🚀 Server listening on port ${port}`);
});
