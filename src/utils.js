const path = require("path");
const fs = require("fs");
const short = require('short-uuid');
const directoryPath = path.join(__dirname, "agent/intents");
const { NlpManager } = require("node-nlp");

async function detectIntent(query, sessionId = null, model) {
  const manager = new NlpManager({ languages: ["pt"], forceNER: true });
  await manager.load(model);

  const nluResponse = await manager.process("pt", query);

  const response = makeResponse(nluResponse, sessionId);

  return response;
}

function generateRandomToken() {
  return short.generate();
}

async function trainModel(intents) {
  const manager = new NlpManager({ languages: ["pt"], forceNER: true });

  const groupedIntents = groupIntentsByContext(intents);

  for (const context in groupedIntents) {
    const groupIntents = groupedIntents[context];
    const contextManager = new NlpManager({ languages: ["pt"], forceNER: true });

    groupIntents.intents.map((groupIntent) => {
      groupIntent.utterances.map((phrase) => {
        contextManager.addDocument("pt", phrase, groupIntent.slug);
      });

      addResponses(groupIntent, groupIntent.slug, contextManager);
    });

    await saveModel(contextManager, `./data/model-${context}.nlp`);
  }

  intents.map((intent) => {
    const intentSlug = intent.slug;
    const intentDomain = intent.domain;
    const intentContext = intent.inputContexts;

    if (intentContext.length === 0) {
      if (intentDomain) {
        manager.assignDomain("pt", intentSlug, intentDomain);
      }

      intent.utterances.map((phrase) => {
        manager.addDocument("pt", phrase, intentSlug);
      });

      addResponses(intent, intentSlug, manager);
    }
  });

  await saveModel(manager);
}

function groupIntentsByContext(intents) {
  const groupedIntents = {};
  intents.map((intent) => {
    const intentId = intent.id;
    const intentContext = intent.inputContexts;

    if (intentContext) {
      intent.inputContexts.map((context) => {
        const contextName = context.name;

        if (!groupedIntents[contextName]) {
          groupedIntents[contextName] = {
            name: contextName,
            intents: [],
          };
        }

        groupedIntents[contextName].intents.push({
          id: intentId,
          name: intent.name,
          slug: intent.slug,
          responses: intent.responses,
          utterances: intent.utterances,
        });
      });
    }
  });

  return groupedIntents;
}

async function addResponses(intent, intentSlug, manager) {
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

  return manager;
}

async function train () {
  console.log(`${'[Aurora]'.yellow} Bot is training`);
  const intents = await readIntents();
  await trainModel(intents);
}

async function writeIntent(intent, fileName) {
  const json = JSON.stringify(intent);
  const intentPath = path.join(__dirname, 'agent' ,'intents', fileName + ".json");
  fs.writeFileSync(intentPath, json, "utf8", (err) => {
    if (err) {
      console.log(err);
    }
  });
}

async function removeIntent(fileName) {
  const intentPath = path.join(__dirname, 'agent' ,'intents', fileName + ".json");

  fs.unlink(intentPath, function (err) {
    if (err) throw err;
});
}

async function saveModel(manager, fileName = "./data/model.nlp") {
  await manager.train();
  manager.save(fileName);
}

function decreaseContexts(contexts) {
  const contextsToDecrease = contexts.filter((context) => context.lifespanCount > 1);

  const newContexts = contextsToDecrease.map((context) => {
    context.lifespanCount = context.lifespanCount - 1;

    return context;
  });

  return newContexts;
}

function getContextNameModel(context) {
  let path = "./data/model.nlp";
  if (context && context.name) {
    const contextName = context.name;
    path = `./data/model-${contextName}.nlp`;
    console.log(path);
  }
  return path;
}

function groupContextsByName(contexts) {
  if (contexts.length === 0) {
    return [];
  }

  const groupedContexts = {};

  contexts.map((context) => {
    const contextName = context.name;

    if (!groupedContexts[contextName]) {
      groupedContexts[contextName] = {
        name: contextName,
        lifespanCount: 0,
      };
    }

    groupedContexts[contextName].lifespanCount += context.lifespanCount;
  });

  return groupedContexts;
}

function updateContexts(contexts) {
  const groupedContexts = groupContextsByName(contexts);
  const newContexts = [];

  for (const contextName in groupedContexts) {
    const context = groupedContexts[contextName];

    newContexts.push({
      name: context.name,
      lifespanCount: context.lifespanCount,
    });
  }

  return newContexts;
}

async function makeResponse(nluResponse, sessionId) {
  const { intent, entities, context } = nluResponse;
  const { confidence, value } = intent;
  const { lifespan } = context;
  const { text, confidence: entityConfidence, entity, metadata } = entities[0];

  return {
    sessionId,
    intent: {
      confidence,
      value,
    },
    entities: {
      text,
      confidence: entityConfidence,
      entity,
      metadata,
    },
    context: {
      lifespan,
    },
  };
}

async function makeResponse(response, sessionId = null) {
  const intentData = await getIntentData(response.intent);

  const entities = response.entities.map((entity) => {
    return {
      entityType: entity.entity,
      value: entity.resolution.value,
      source: entity.utteranceText,
      confidence: entity.accuracy,
    };
  });

  const intent = {
    isFallback: response.intent === "None" ? true : false,
    displayName: intentData.name,
    endInteraction: intentData.endInteraction,
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
      const random = Math.floor(Math.random() * (messageText.length - 1 + 1) + 1) - 1;
      messageVariation.push(messageText[random]);
    } else {
      messageVariation.push(messageText[0]);
    }

    return {
      text: messageVariation[0],
    }
  });

  return {
    id: sessionId ? sessionId : short.generate(),
    fulfillmentText: messages.length === 1 ? messages[0].text : "",
    utterance: response.utterance,
    languageCode: response.localeIso2,
    confidence: response.score,
    entities: entities,
    webhook: webhook,
    inputContexts: intentData.inputContexts || [],
    outputContexts: intentData.outputContexts || [],
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

module.exports = { readIntents, trainModel, saveModel, detectIntent, decreaseContexts, generateRandomToken, groupContextsByName, updateContexts, getContextNameModel, writeIntent, removeIntent, train };
