import redis from "redis";

const client = redis.createClient({
    host: process.env.REDIS_IP,
    port: process.env.REDIS_PORT,
});

import intentValidator from "../validators/IntentCreateValidator.js";

import Context from "../models/Context.js";
import File from "../models/File.js";
import Intent from "../models/Intent.js";
import Model from "../models/Model.js";
import Text from "../models/Text.js";
import Token from "../models/Token.js";

export default class IntentController {
    async detect(req, res) {
        const intentText = req.query.text;
        const sessionId = req.query.sessionId || Token.generate();

        let parameters = {};

        try {
            parameters = JSON.parse(req.query.parameters);
        } catch (e) {
            parameters = {};
        }

        client.get(sessionId, async (err, session) => {
            if (session) {
                try {
                    const sessionParameters = JSON.parse(session);

                    const modelName =
                        Context.getName(sessionParameters.outputContexts[0]) ||
                        "model.nlp";

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

                    Text.logData(
                        sessionId,
                        response.intent.displayName,
                        intentText,
                        response.messages,
                        parameters,
                        inputContexts,
                        outputContexts
                    );

                    client.setex(sessionId, 1440, JSON.stringify(newSession));

                    Text.logMessage("Detected intent correctly");

                    res.send(response);
                } catch (error) {
                    Text.logMessage("Error on detecting intent");

                    Text.logError(error);
                    res.status(500).send({
                        status: "500",
                        message: "Error on detect intent",
                    });
                }
            } else {
                try {
                    const response = await Model.detect(
                        intentText,
                        sessionId,
                        "model.nlp",
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
                    Text.logMessage("Detected intent correctly");

                    res.send(response);
                } catch (error) {
                    Text.logMessage("Error on detect intent");

                    Text.logError(error);
                    res.status(500).send({
                        status: "500",
                        message: "Error on detecting intent",
                    });
                }
            }
        });
    }

    async index(req, res) {
        const intents = await File.readIntents();
        res.send(intents);
    }

    async create(req, res) {
        const reqIntent = req.body;

        try {
            const request = await intentValidator.validateAsync(reqIntent);
            const intents = await File.readIntents();

            request.slug = Text.slugify(request.name);

            const intentData = intents.find(i => i?.slug === request.slug);

            if (intentData) {
                Text.logMessage("Intent already exists");
                res.status(409).send({
                    status: "409",
                    message: "Intent already exists",
                });
                return;
            }

            const intent = new Intent(request);

            if (intent.isValid()) {
                await File.writeIntent(intent.toJSON(), request.slug);
                Text.logMessage("Intent created");
                res.status(201).send({
                    status: "201",
                    message: "Intent created",
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

    async update(req, res) {
        const intentId = req.params.id;
        const reqIntent = req.body;

        try {
            const request = await intentValidator.validateAsync(reqIntent);
            const intents = await File.readIntents();

            const intent = intents.find(i => i?.id === intentId);

            if (!intent) {
                Text.logMessage("Intent not exists");
                res.status(404).send({
                    status: "404",
                    message: "Intent not exists",
                });
                return;
            }

            const intentData = {
                ...intent,
                ...request,
                id: intent.id,
                slug: intent.slug,
            };

            const updatedIntent = new Intent(intentData);

            if (updatedIntent.isValid()) {
                await File.removeIntent(intentData.slug);
                await File.writeIntent(updatedIntent.toJSON(), intentData.slug);
                Text.logMessage("Intent updated");
                res.status(204).send({
                    status: "204",
                    message: "Intent updated",
                });
                Model.train();
            } else {
                Text.logMessage("Intent not updated");
                res.status(400).send({
                    status: "400",
                    message: "Intent not updated",
                });
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

    async destroy(req, res) {
        const intentId = req.params.id;
        const intents = await File.readIntents();

        if (!intentId) {
            Text.logMessage("Intent not found");

            res.status(404).send({
                status: "404",
                message: "Intent not found",
            });
            return;
        }

        const intent = intents.find(i => i?.id === intentId);

        if (!intent) {
            Text.logMessage("Intent not found");

            res.status(404).send({
                status: "404",
                message: "Intent not found",
            });
            return;
        }

        await File.removeIntent(intent?.slug);

        Text.logMessage("Intent deleted");
        res.status(200).send({
            status: "200",
            message: "Intent deleted",
        });

        Model.train();
    }
}
