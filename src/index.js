const express = require("express");
const app = express();

const url = "localhost" || process.env.URL;
const port = 3000 || process.env.PORT;

const colors = require("colors");

const intentRouter = require('./routes/intent.routes');

app.use('/', intentRouter);

app.get("/", (req, res) => {
  res.send("Aurora API");
});

app.listen(port, () => {
  console.log(`${'[Aurora]'.yellow} Server is running on http://${url}:${port}`);
});
