const express = require("express");
const app = express();
const url = "localhost" || process.env.URL;
const port = 3000 || process.env.PORT;
const colors = require("colors");
const utils = require("./utils");
const redis = require('redis');

const client = redis.createClient(6379);

app.get('/detectIntent', async function (req, res) {
  const intentText = req.query.text;
  const sessionId = req.query.sessionId || utils.generateRandomToken();

  client.get(sessionId, async (err, session) => {
    if (session) {
      const sessionParameters = JSON.parse(session);

      let newSession = {
        ...sessionParameters
      };

      const modelName = utils.getContextNameModel(sessionParameters.outputContexts[0]) || "./data/model.nlp";

      const response = await utils.detectIntent(intentText, sessionId, modelName );
      
      let inputContexts = sessionParameters.inputContexts.concat(response.inputContexts);
      let outputContexts = sessionParameters.outputContexts.concat(response.outputContexts);

      console.log(colors.green(`Session: ${sessionId}`));
      console.log(colors.green(`Response: ${JSON.stringify(response.messages)}`));
      console.log(colors.green(`Input contexts: ${JSON.stringify(inputContexts)}`));
      console.log(colors.green(`Output contexts: ${JSON.stringify(outputContexts)}`));

      newSession = {
        ...newSession,
        inputContexts: utils.decreaseContexts(utils.updateContexts(inputContexts)),
        outputContexts: utils.decreaseContexts(utils.updateContexts(outputContexts)),
        lastIntent: response.intent
      };

      console.log(newSession);

      client.setex(sessionId, 1440, JSON.stringify(newSession));

      console.log(`${'[Aurora]'.yellow} Detected intent correctly`);

      res.send(response);
    } else {
      const response = await utils.detectIntent(intentText, sessionId);

      const inputContexts = response.inputContexts || [];
      const outputContexts = response.outputContexts || [];

      const sessionParameters = {
        sessionId: sessionId,
        lastIntent: response.intent,
        parameters: [],
        inputContexts: inputContexts && inputContexts != [] ? utils.updateContexts(inputContexts) : inputContexts,
        outputContexts: outputContexts && outputContexts != [] ? utils.updateContexts(response.outputContexts) : outputContexts,
      }

      console.log(sessionParameters);

      client.setex(sessionId, 1440, JSON.stringify(sessionParameters));
      
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
  console.log(`${'[Aurora]'.yellow} Server is running on http://${url}:${port}`);
});
