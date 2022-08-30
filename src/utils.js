const path = require("path");
const fs = require("fs");
const short = require('short-uuid');
const directoryPath = path.join(__dirname, "agent/intents");
const { NlpManager } = require("node-nlp");
const axios = require("axios");

async function detectIntent(query, sessionId = null, model = "./src/agent/data/model.nlp", parameters) {
	const modelIsValid = await verifyModel(model);

	if (!modelIsValid) {
		console.log(`${'[AMUP]'.yellow} Bot is training`);

		await trainModel(await readIntents());

		setTimeout(() => {
			console.log(`${'[AMUP]'.yellow} Bot is trained sucessfully`);
		}, 100);
	}

	console.log(`${'[AMUP]'.yellow} Bot is detecting intent`);
	const manager = new NlpManager({ languages: ["pt"], forceNER: true });

	manager.load(model);

	const nluResponse = await manager.process("pt", query);
	const response = makeResponse(nluResponse, sessionId, parameters);

	return response;
}

function createDataFolder() {
	if (!fs.existsSync("./src/agent/data")) {
		fs.mkdirSync("./src/agent/data");
	}
}

function generateRandomToken() {
	return short.generate();
}

async function verifyModel(modelName) {
	if (fs.existsSync(modelName)) {
		return true;
	}
	return false;
}

async function trainModel(intents) {
	const manager = new NlpManager({ languages: ["pt"], forceNER: true });

	const groupedIntents = groupIntentsByContext(intents);

	createDataFolder();

	for (const context in groupedIntents) {
		const groupIntents = groupedIntents[context];
		const contextManager = new NlpManager({ languages: ["pt"], forceNER: true });

		groupIntents.intents.map((groupIntent) => {
			groupIntent.utterances.map((phrase) => {
				contextManager.addDocument("pt", phrase, groupIntent.slug);
			});


			addResponses(groupIntent, groupIntent.slug, contextManager);
		});

		await saveModel(contextManager, `./src/agent/data/model-${context}.nlp`);
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

			if (intent.entities) {
				intent.entities.map((entity) => {
					manager.addNamedEntityText(entity.type, entity.name, ['pt'], entity.phrases);
				});
			}

			addResponses(intent, intentSlug, manager);
		}
	});

	removeOldModel("./src/agent/data/model.nlp");

	await saveModel(manager, "./src/agent/data/model.nlp");
}

function removeOldModel(modelName) {
	if (fs.existsSync(modelName)) {
		fs.unlinkSync(modelName);
	}
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
			if (message.type != "suggestions") {
				if (message.text.length > 0) {
					for (const text of message.text) {
						manager.addAnswer("pt", intentSlug, text);
					}
				} else {
					manager.addAnswer("pt", intentSlug, message.text[0]);
				}
			}
		});
	});

	return manager;
}

async function train() {
	console.log(`${'[Aurora]'.yellow} Bot is training`);
	const intents = await readIntents();
	await trainModel(intents);
}

async function writeIntent(intent, fileName) {
	const json = JSON.stringify(intent);
	const intentPath = path.join(__dirname, 'agent', 'intents', fileName + ".json");
	fs.writeFileSync(intentPath, json, "utf8", (err) => {
		if (err) {
			console.log(err);
		}
	});
}

async function removeIntent(fileName) {
	const intentPath = path.join(__dirname, 'agent', 'intents', fileName + ".json");

	fs.unlink(intentPath, function (err) {
		if (err) throw err;
	});
}

async function saveModel(manager, fileName = "./src/agent/data/model.nlp") {
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
	let path = "./src/agent/data/model.nlp";
	if (context && context.name) {
		const contextName = context.name;
		path = `./src/agent/data/model-${contextName}.nlp`;
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

async function makeResponse(response, sessionId = null, parameters) {
	const intentData = await getIntentData(response.intent);

	const entities = response.entities.map((entity) => {
		const entityValue = entity && entity.resolution && entity.resolution.value ? entity?.resolution?.value : entity.option;
		const entitySource = entity.utteranceText ? entity.utteranceText : entity.type;

		return {
			entityType: entity.entity,
			value: entityValue,
			source: entitySource,
			confidence: entity.accuracy,
		};
	});

	const intent = {
		isFallback: response.intent === "None" ? true : false,
		displayName: intentData.name,
		endInteraction: intentData.endInteraction,
		id: short.generate()
	}

	const sentiment = {
		queryTextSentiment: {
			score: response.sentiment.score,
			type: response.sentiment.type,
			vote: response.sentiment.vote
		}
	}

	let messages = [];
	let suggestions = [];

	intentData.responses.map((response) => {
		const message = response.message[0];
		const messageText = message.text;

		if (message.type !== "suggestions") {
			let messageVariation = [];

			if (messageText.length > 1) {
				const random = Math.floor(Math.random() * (messageText.length - 1 + 1) + 1) - 1;

				messageVariation.push(messageText[random]);
			} else {
				messageVariation.push(messageText[0]);
			}

			messages.push({
				text: messageVariation[0],
			});
		}

		if (message.type === "suggestions") {
			suggestions.push(message.text);
		}

		for (let i = 0; i < messages.length; i++) {
			const element = messages[i];
			element.suggestions = suggestions[i];
		}

		messages.map((message) => {
			if (message.text && parameters && parameters.first_name) {
				message.text = message.text.replace(/\$first_name/g, parameters.first_name);
			}
			if (message.text && parameters && parameters.last_name) {
				message.text = message.text.replace(/\$last_name/g, parameters.last_name);
			}
			if (message.text && parameters && parameters.email) {
				message.text = message.text.replace(/\$email/g, parameters.email);
			}
			if (message.text && parameters && parameters.phone) {
				message.text = message.text.replace(/\$phone/g, parameters.phone);
			}
			if (message.text && parameters && parameters.address) {
				message.text = message.text.replace(/\$address/g, parameters.address);
			}
		});
	});

	const webhookEnabled = intentData.webhookUsed;

	const webhook = {
		webhookUsed: webhookEnabled
	}

	let payload = {
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

	console.log("webhookEnabled", webhookEnabled);

	if (webhookEnabled) {
		const webhookResponse = await sendWebhook(sessionId, intent, entities, messages, parameters);
		payload.messages = webhookResponse && webhookResponse.messages ? webhookResponse.messages : [];

		return payload
	}

	return payload
}

async function sendWebhook(sessionId, intent, entities, messages, parameters) {
	const webhookUrl = process.env.WEBHOOK_URL;
	const webhookSecret = process.env.WEBHOOK_SECRET;
	console.log(webhookUrl);
	console.log(webhookSecret);
	console.log('====================');
	const webhookPayload = {
		sessionId: sessionId,
		intent: intent,
		entities: entities,
		parameters: parameters,
		messages: messages,

	};
	const webhookHeaders = {
		"Content-Type": "application/json",
		"Authorization": webhookSecret,
	};

	try {
		const response = await axios.post(webhookUrl, webhookPayload, { headers: webhookHeaders });
		return response.data;
	} catch (error) {
		console.log(error);
	}
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

function slugify(text) {
	return text
		.toString()
		.toLowerCase()
		.replace("intent", '') // Remove intent name
		.replace(/\s+/g, '-') // Replace spaces with -
		.replace(/[^\w-]+/g, '') // Remove all non-word chars
		.replace(/--+/g, '-') // Replace multiple - with single -
		.replace(/^-+/, '') // Trim - from start of text
		.replace(/-+$/, ''); // Trim - from end of text
}

function verifyAuthentication(req, res) {
	const bearerHeader = req.headers['Authorization'] || req.headers['authorization'];

	if (bearerHeader) {
		const bearer = bearerHeader.split(' ');
		const bearerToken = bearer[1];
		if (bearerToken === process.env.AUTH_TOKEN) {
			return true;
		} else {
			res.status(403).send('Forbidden');
			return false;
		}

	} else {
		res.sendStatus(403);
		return false;
	}
}

module.exports = {
	readIntents,
	trainModel,
	saveModel,
	detectIntent,
	decreaseContexts,
	generateRandomToken,
	groupContextsByName,
	updateContexts,
	getContextNameModel,
	writeIntent,
	removeIntent,
	train,
	verifyAuthentication,
	slugify,
	verifyModel
};
