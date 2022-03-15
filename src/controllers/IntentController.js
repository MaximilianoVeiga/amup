const redis = require('redis');
const client = redis.createClient(6379);
const utils = require("../utils");
const colors = require("colors");
const Intent = require('../models/Intent');

class IntentController {
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

          const modelName = utils.getContextNameModel(sessionParameters.outputContexts[0]) || "./data/model.nlp";

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
    }
  }

  async train(req, res) {
    if (utils.verifyAuthentication(req, res)) {
      console.log(`${'[Aurora]'.yellow} Bot is training`);
      res.status(200).send({ "status": "200" });
      const intents = await utils.readIntents();
      await utils.trainModel(intents);

      console.log(`${'[Aurora]'.yellow} Bot is trained sucessfully`);
    }
  }

  async create(req, res) {
    if (utils.verifyAuthentication(req, res)) {

      const reqIntent = req.body;
      const intents = await utils.readIntents();

      if (intents.find(i => i.name === reqIntent.slug)) {
        console.log(`${'[Aurora]'.yellow} Intent already exists`);
        res.status(409).send({ "status": "409", "message": "Intent already exists" });
      } else {
        const intent = new Intent(reqIntent);

        if (intent.isValid()) {
          intents.push(intent);
          await utils.writeIntent(intent.toJSON(), reqIntent.slug);
          console.log(`${'[Aurora]'.yellow} Intent created`);
          res.status(201).send({ "status": "201", "message": "Intent created" });
          utils.train();
        }
      }
    }
  }

  // async update(req, res, next) {
  // }

  async destroy(req, res, next) {
    if (utils.verifyAuthentication(req, res)) {

      const reqIntent = req.query.intent;
      const intents = await utils.readIntents();

      if (!reqIntent) {
        console.log(`${'[Aurora]'.yellow} Intent not found`);
        res.status(404).send({ "status": "404" });
      }

      const intent = intents.find(i => i.name === reqIntent);

      if (intent) {
        utils.removeIntent(intent.slug);
        console.log(`${'[Aurora]'.yellow} Intent deleted`);
        res.status(200).send({ "status": "200" });
        utils.train();
      } else {
        console.log(`${'[Aurora]'.yellow} Intent not found`);
        res.status(404).send({ "status": "404" });
      }
    }
  }

  async health(req, res) {
    res.status(200).send({ "status": "200" });
  }
}

module.exports = new IntentController();