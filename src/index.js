const express = require("express");
const app = express();
const port = 3000 || process.env.PORT;
const colors = require("colors");
const utils = require("./utils");
const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");

app.get("/", (req, res) => {
  res.send("Aurora API");
});

app.get("/train", async (req, res) => {
  console.log(`${'[Aurora]'.yellow} Bot is training`);
  res.send({"status": "200"}).status(200);
  const intents = await utils.processAgent();
  const trainModel = await utils.trainModel(intents);
  console.log(`${'[Aurora]'.yellow} Bot is trained sucessfully`);
});

app.get("/detectIntent", async (req, res) => {
  console.log(`${'[Aurora]'.yellow} Detected intent correctly`);
  const response = await utils.detectIntent(req.query.text);
  res.send(response).status(200);
});

app.get("/openCSV", async (req, res) => {
  console.log(`${'[Aurora]'.yellow} Opening CSV file`);

  const filePath = path.join(__dirname, "emails.csv");
  const results = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      console.log(`${'[Aurora]'.yellow} CSV file is opened`);
      res.send(results).status(200);
    });

  res.send(csv).status(200);
});

app.listen(port, () => {
  console.log(`${'[Aurora]'.yellow} Server is running on http://localhost:${port}`);
});
