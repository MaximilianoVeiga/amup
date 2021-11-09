const express = require("express");
const app = express();
const port = 3000 || process.env.PORT;
const colors = require("colors");
const utils = require("./utils");
const redis = require('redis');

const client = redis.createClient(6379);

app.get('/detectIntent', async function (req, res) {
  const intentText = req.query.text;

  client.get(intentText, async (err, intent) => {
    if (intent) {
      const intentResponse = JSON.parse(intent);
      console.log(`${'[Aurora]'.yellow} Detected intent correctly`);

      res.send(intentResponse);
    } else {
      const response = await utils.detectIntent(intentText);

      client.setex(intentText, 1440, JSON.stringify(response));
      console.log(`${'[Aurora]'.yellow} Detected intent correctly`);

      res.send(response);
    }
  });
});

app.get("/", (req, res) => {
  res.send("Aurora API");
});

app.get("/train", async (req, res) => {
  console.log(`${'[Aurora]'.yellow} Bot is training`);
  res.send({ "status": "200" }).status(200);
  const intents = await utils.readIntents();
  await utils.trainModel(intents);

  console.log(`${'[Aurora]'.yellow} Bot is trained sucessfully`);
});

app.listen(port, () => {
  console.log(`${'[Aurora]'.yellow} Server is running on http://localhost:${port}`);
});
