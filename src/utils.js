const path = require("path");
const fs = require("fs");
const directoryPath = path.join(__dirname, "agent/intents");
const { NlpManager } = require('node-nlp');

async function processAgent() {
  return fs.readdirSync(directoryPath)
           .filter(name => path.extname(name) === '.json')
           .map(name => require(path.join(directoryPath, name)));
}

async function detectIntent(query) {
  const manager = new NlpManager({ languages: ['pt'], forceNER: true });
  await manager.load();

  const response = await manager.process('pt', query);

  return response;
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
