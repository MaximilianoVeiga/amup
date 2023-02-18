const colors = require("colors");

const redis = require("redis");

const client = redis.createClient({
    host: process.env.REDIS_IP,
    port: process.env.REDIS_PORT,
});

const intentValidator = require("../validators/IntentCreateValidator");

const Auth = require("../models/Auth");
const Context = require("../models/Context");
const Intent = require("../models/Intent");
const Token = require("../models/Token");
const Model = require("../models/Model");
const File = require("../models/File");
const Text = require("../models/Text");

class IntentController {
    async detect(req, res) {
        if (Auth.verify(req, res)) {
            const intentText = req.query.text;
            const sessionId = req.query.sessionId || Token.generate();

            let parameters = {};

            try {
                parameters = JSON.parse(req.query.parameters);
            } catch (e) {}

            client.get(sessionId, async (err, session) => {
                if (session) {
                    const sessionParameters = JSON.parse(session);

                    const modelName =
                        Context.getName(sessionParameters.outputContexts[0]) ||
                        "./src/agent/data/model.nlp";

                    parameters = {
                        ...parameters,
                        ...sessionParameters.parameters,
                    };

                    const response = await Model.detect(
                        intentText,
                        sessionId,
                        modelName,
                        parameters
                    );

                    parameters = {
                        ...parameters,
                        ...response.parameters,
                    };

                    const inputContexts = [
                        ...sessionParameters.inputContexts,
                        ...response.inputContexts,
                    ];
                    const outputContexts = [
                        ...sessionParameters.outputContexts,
                        ...response.outputContexts,
                    ];

                    const newSession = {
                        parameters: parameters,
                        inputContexts: Context.decrease(
                            Context.update(inputContexts)
                        ),
                        outputContexts: Context.decrease(
                            Context.update(outputContexts)
                        ),
                        lastIntent: response.intent,
                    };

                    if (response.endInteraction) {
                        newSession.parameters = {};
                        newSession.inputContexts = [];
                        newSession.outputContexts = [];
                        newSession.lastIntent = {};
                    }

                    response.outputContexts = newSession.outputContexts;
                    response.inputContexts = newSession.inputContexts;

                    Intent.logData(
                        sessionId,
                        response.intent.displayName,
                        intentText,
                        response.messages,
                        parameters,
                        inputContexts,
                        outputContexts
                    );

                    client.setex(sessionId, 1440, JSON.stringify(newSession));

                    console.log(`${"[AMUP]".yellow} Detected intent correctly`);

                    res.send(response);
                } else {
                    const response = await Model.detect(
                        intentText,
                        sessionId,
                        "./src/agent/data/model.nlp",
                        parameters
                    );

                    const inputContexts = response.inputContexts || [];
                    const outputContexts = response.outputContexts || [];

                    const sessionParameters = {
                        sessionId: sessionId,
                        lastIntent: response.intent,
                        parameters: parameters ? parameters : [],
                        inputContexts:
                            inputContexts && inputContexts != []
                                ? Context.update(inputContexts)
                                : inputContexts,
                        outputContexts:
                            outputContexts && outputContexts != []
                                ? Context.update(response.outputContexts)
                                : outputContexts,
                    };

                    client.setex(
                        sessionId,
                        1440,
                        JSON.stringify(sessionParameters)
                    );
                    console.log(`${"[AMUP]".yellow} Detected intent correctly`);

                    res.send(response);
                }
            });
        }
    }

    async index(req, res) {
        if (Auth.verify(req, res)) {
            const intents = await File.readIntents();
            res.send(intents);
        }
    }

    async create(req, res) {
        if (Auth.verify(req, res)) {
            const reqIntent = req.body;

            try {
                const request = await intentValidator.validateAsync(reqIntent);
                const intents = await File.readIntents();

                request.slug = Text.slugify(request.name);

                if (intents.find(i => i.slug === request.slug)) {
                    console.log(`${"[AMUP]".yellow} Intent already exists`);
                    res.status(409).send({
                        status: "409",
                        message: "Intent already exists",
                    });
                } else {
                    const intent = new Intent(request);

                    if (intent.isValid()) {
                        intents.push(intent);
                        await File.writeIntent(intent.toJSON(), request.slug);
                        console.log(`${"[AMUP]".yellow} Intent created`);
                        res.status(201).send({
                            status: "201",
                            message: "Intent created",
                        });
                        Intent.train();
                    }
                }
            } catch (err) {
                console.error(err);
                const payload = {
                    status: "400",
                    errors: err.details.map(e => e.message.replace(/\"/g, "")),
                };
                await res.status(400).send(payload);
            }
        }
    }

    async update(req, res) {
        if (Auth.verify(req, res)) {
            const intentId = req.params.id;
            const reqIntent = req.body;

            try {
                const request = await intentValidator.validateAsync(reqIntent);
                const intents = await File.readIntents();

                request.slug = Text.slugify(request.name);

                const intent = intents.find(i => i.id === intentId);
                if (!intent) {
                    console.log(`${"[AMUP]".yellow} Intent not exists`);
                    res.status(404).send({
                        status: "404",
                        message: "Intent not exists",
                    });
                    return;
                }

                const updatedIntent = new Intent(request);
                updatedIntent.id = intentId;

                if (updatedIntent.isValid()) {
                    File.removeIntent(intent.slug);
                    await File.writeIntent(
                        updatedIntent.toJSON(),
                        updatedIntent.slug
                    );
                    console.log(`${"[AMUP]".yellow} Intent updated`);
                    res.status(201).send({
                        status: "201",
                        message: "Intent updated",
                    });
                    Model.train();
                }
            } catch (err) {
                console.error(err);
                const payload = {
                    status: "400",
                    errors: err.details.map(e => e.message.replace(/\"/g, "")),
                };
                await res.status(400).send(payload);
            }
        }
    }

    async destroy(req, res) {
        if (Auth.verify(req, res)) {
            const intentId = req.params.id;
            const intents = await File.readIntents();

            if (!intentId) {
                console.log(`${"[AMUP]".yellow} Intent not found`);
                res.status(404).send({ status: "404" });
            }

            const intent = intents.find(i => i.id === intentId);

            if (intent) {
                File.removeIntent(intent.slug);
                console.log(`${"[AMUP]".yellow} Intent deleted`);
                res.status(200).send({
                    status: "200",
                    message: "Intent deleted",
                });
                Model.train();
            } else {
                console.log(`${"[AMUP]".yellow} Intent not found`);
                res.status(404).send({
                    status: "404",
                    message: "Intent not found",
                });
            }
        }
    }
}

module.exports = new IntentController();
