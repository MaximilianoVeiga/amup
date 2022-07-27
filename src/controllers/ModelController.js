const utils = require("../utils");
const colors = require("colors");
const redis = require('redis');
const client = redis.createClient({
      host: '172.10.0.2',
      port: 6379
});

class ModelController {
  async detect(req, res, next) {
    if (utils.verifyAuthentication(req, res)) {

      const intentText = req.query.text;
      const sessionId = req.query.sessionId || utils.generateRandomToken();

      client.get(sessionId, async (err, session) => {
        if (session) {
          const sessionParameters = JSON.parse(session);

          let newSession = {
            ...sessionParameters
          };

          const modelName = utils.getContextNameModel(sessionParameters.outputContexts[0]) || "./src/agent/data/model.nlp";

          const response = await utils.detectIntent(intentText, sessionId, modelName);

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

          console.log(`${'[AMUP]'.yellow} Detected intent correctly`);

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
          console.log(`${'[AMUP]'.yellow} Detected intent correctly`);

          res.send(response);
        }
      });
    }
  }

  async train(req, res) {
    if (utils.verifyAuthentication(req, res)) {
      console.log(`${'[AMUP]'.yellow} Bot is training`);
      res.status(200).send({ "status": "200" });
      const intents = await utils.readIntents();
      await utils.trainModel(intents);

      console.log(`${'[AMUP]'.yellow} Bot is trained sucessfully`);
    } 
  }
}

module.exports = new ModelController();