require('dotenv').config();
const express = require('express');
const app = express();

//* Database Connection
const mongoose = require("mongoose");
const db = mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
});

// Parser for the request body
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Check for Cors
const cors = require("cors");
app.use(cors({
    domains: '*',
    methods: "*"
}));

app.listen(3001, () => console.log(`Server listening on port 3001!`));
