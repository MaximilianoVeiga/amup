const path = require("path");
const fs = require("fs");
const short = require('short-uuid');
const directoryPath = path.join(__dirname, "agent/intents");
const { NlpManager } = require("node-nlp");

async function detectIntent(query) {
  const manager = new NlpManager({ languages: ["pt"], forceNER: true });
  await manager.load();

  const nluResponse = await manager.process("pt", query);

  const response = makeResponse(nluResponse);

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

    intent.responses.map((response) => {
      response.message.map((message) => {
        if (message.text.length > 1) {
          for (const text of message.text) {
            manager.addAnswer("pt", intentSlug, text);
          }
        } else {
          manager.addAnswer("pt", intentSlug, message.text[0]);
        }
      });
    });
  });

  await saveModel(manager);
}

async function saveModel(manager) {
  await manager.train();
  manager.save();
}

async function makeResponse (response) {
  const intentData = await getIntentData(response.intent);

  const entities = response.entities.map((entity) => {
    return {
      entityType: entity.entity,
      value: entity.resolution.value,
      source: entity.utteranceText,
      confidence: entity.accuracy,
    };
  });

  const intent =  {
    isFallback: response.intent === "None" ? true : false,
    displayName: intentData.name,
    id: short.generate()
  }

  const webhook = {
    webhookUsed: false
  }

  const sentiment = {
    queryTextSentiment: {
      score: response.sentiment.score,
      type: response.sentiment.type,
      vote: response.sentiment.vote
    }
  }

  const messages = intentData.responses.map((response) => {
    const message = response.message[0];

    const messageText = message.text;

    let messageVariation = [];

    if (messageText.length > 1) {
      const random = Math.floor(Math.random()*(messageText.length-1+1)+1)-1;
      messageVariation.push(messageText[random]);
    } else {
      messageVariation.push(messageText[0]);
    }

    return {
      text: messageVariation[0],
    }
  });

  return {
    id: short.generate(),
    fulfillmentText: messages.length === 1 ? messages[0].text : "",
    utterance: response.utterance,
    languageCode: response.localeIso2,
    confidence: response.score,
    entities: entities,
    webhook: webhook,
    messages: messages,
    sentimentAnalysisResult: sentiment,
    intent: intent,
  };
}

async function getIntentData(slug) {
  const intents = await readIntents();

  return intents.find((intent) => intent.slug === slug);
}

async function readIntents() {
  return fs
    .readdirSync(directoryPath)
    .filter((name) => path.extname(name) === ".json")
    .map((name) => require(path.join(directoryPath, name)));
}

module.exports = { readIntents, trainModel, saveModel, detectIntent };
