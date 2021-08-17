const path = require("path");
const fs = require("fs");
const directoryPath = path.join(__dirname, "agent/intents");
const { NlpManager } = require('node-nlp');
const { v4: uuidv4 } = require('uuid');

async function processAgent() {
  return fs.readdirSync(directoryPath)
           .filter(name => path.extname(name) === '.json')
           .map(name => require(path.join(directoryPath, name)));
}

async function detectIntent(query) {
  const manager = new NlpManager({ languages: ['pt'], forceNER: true });
  await manager.load();

  const response = await manager.process('pt', query);

  const getTag = require(path.join(directoryPath, response.intent));

  const processResponse = {
    responseId: uuidv4(),
    queryText: response.utterance,
    intent: response.intent === "None" ? "fallback" : response.intent,
    tag: getTag.tag,
    entities: response.entities,
    response: response.answers,
    intentDetectionConfidence: response.score,
    actions: response.actions,
    sentiment: response.sentiment,
  };

  return processResponse;
}

async function trainModel(intents) {
  const manager = new NlpManager({ languages: ["pt"], forceNER: true });

  intents.map((intent) => {
    const intentName = intent.name;
    const intentSlug = intent.slug;

    intent.training.map((training) => {
      manager.addDocument("pt", training, intentSlug);
    });

    intent.response.map((response) => {
      manager.addAnswer("pt", intentSlug, response);
    });
  });

  await saveModel(manager);
}

async function saveModel(manager) {
  await manager.train();
  manager.save();
}

module.exports = { processAgent, trainModel, saveModel, detectIntent };
