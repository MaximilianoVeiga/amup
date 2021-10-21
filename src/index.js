const express = require("express");
const app = express();
const port = 3000 || process.env.PORT;
const colors = require("colors");
const utils = require("./utils");

app.get('/detectIntent', async function(req, res) {
  if (req.query.text) {
    const text = req.query.text;
    const response = await utils.detectIntent(text);

    console.log(`${'[Aurora]'.yellow} Detected intent correctly`);
    res.send(response);
  } else {
    res.send("No text provided");
  }
});

app.get("/", (req, res) => {
  res.send("Aurora API");
});

app.get("/train", async (req, res) => {
  console.log(`${'[Aurora]'.yellow} Bot is training`);
  res.send({"status": "200"}).status(200);
  const intents = await utils.readIntents();
  await utils.trainModel(intents);

  console.log(`${'[Aurora]'.yellow} Bot is trained sucessfully`);
});

app.listen(port, () => {
  console.log(`${'[Aurora]'.yellow} Server is running on http://localhost:${port}`);
});
