const path = require("path");
const fs = require("fs");
const directoryPath = path.join(__dirname, "agent/intents");
const { NlpManager } = require("node-nlp");

async function detectIntent(query) {
  const manager = new NlpManager({ languages: ["pt"], forceNER: true });
  await manager.load();

  const response = await manager.process("pt", query);

  return response;
}

async function trainModel(intents) {
  const manager = new NlpManager({ languages: ["pt"], forceNER: true });

  intents.map((intent) => {
    const intentName = intent.name;
    const intentSlug = intent.slug;
    const intentContext = intent.context;

    if (intentContext) {
      manager.assignDomain(intentName, intentSlug, intentContext);
    }

    intent.utterances.map((training) => {
      manager.addDocument("pt", training, intentSlug);
    });

    //TODO: Implement variation of messages
    let count = 0;
    intent.responses.map((response) => {
      response.message.map((message) => {
        if (text >= 1) {
          for (const text of message.text) {
            console.log(`${intentName} - ${text}`);
            manager.addAnswer("pt", intentSlug, text, "messageVariation" + count);
          }
        } else {
          manager.addAnswer("pt", intentSlug, text[0]);
        }
      });
      count++;
    });
  });

  await saveModel(manager);
}

async function saveModel(manager) {
  await manager.train();
  manager.save();
}

async function readIntents() {
  return fs
    .readdirSync(directoryPath)
    .filter((name) => path.extname(name) === ".json")
    .map((name) => require(path.join(directoryPath, name)));
}

module.exports = { readIntents, trainModel, saveModel, detectIntent };
