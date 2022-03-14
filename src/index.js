const path = require('path');

require('dotenv').config({path: path.join(__dirname, '..', '.env')})

const express = require("express");
const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.json());

const url = process.env.URL || "localhost";
const port = process.env.PORT || 3000;

const colors = require("colors");

const intentRouter = require('./routes/intent.routes');

app.use('/', intentRouter);

app.get("/", (req, res) => {
  res.send("Aurora API");
});

app.listen(port, () => {
  console.log(`${'[Aurora]'.yellow} Server is running on http://${url}:${port}`);
});
