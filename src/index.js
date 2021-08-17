const express = require("express");
const app = express();
const port = 3000 || process.env.PORT;
const colors = require("colors");
const utils = require("./utils");

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

// app.get("/detectCase", (req, res) => {
//   console.log(`${'[Aurora]'.yellow} Detected intent correctly`);
//   res.send("404");
// });

app.listen(port, () => {
  console.log(`${'[Aurora]'.yellow} Server is running on http://localhost:${port}`);
});
