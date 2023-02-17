const utils = require("../utils");
const colors = require("colors");
const redis = require("redis");
const client = redis.createClient({
    host: process.env.REDIS_IP,
    port: process.env.REDIS_PORT,
});

class ModelController {
    async detect(req, res) {
        if (utils.verifyAuthentication(req, res)) {
            const intentText = req.query.text;
            const sessionId =
                req.query.sessionId || utils.generateRandomToken();
            let parameters;

            try {
                parameters = JSON.parse(req.query.parameters);
            } catch (e) {}

            client.get(sessionId, async (err, session) => {
                if (session) {
                    const sessionParameters = JSON.parse(session);

                    let newSession = {
                        ...sessionParameters,
                    };

                    const modelName =
                        utils.getContextNameModel(
                            sessionParameters.outputContexts[0]
                        ) || "./src/agent/data/model.nlp";

                    parameters = {
                        ...parameters,
                        ...sessionParameters.parameters,
                    };

                    const response = await utils.detectIntent(
                        intentText,
                        sessionId,
                        modelName,
                        parameters
                    );

                    parameters = {
                        ...parameters,
                        ...response.parameters,
                    };

                    let inputContexts = sessionParameters.inputContexts.concat(
                        response.inputContexts
                    );
                    let outputContexts =
                        sessionParameters.outputContexts.concat(
                            response.outputContexts
                        );

                    console.log(colors.green(`Session: ${sessionId}`));
                    console.log(
                        colors.green(`Intent: ${response.intent.displayName}`)
                    );
                    console.log(colors.green(`Input: ${intentText}`));
                    console.log(
                        colors.green(
                            `Response: ${JSON.stringify(response.messages)}`
                        )
                    );
                    console.log(
                        colors.green(
                            `Parameters: ${JSON.stringify(parameters)}`
                        )
                    );
                    console.log(
                        colors.green(
                            `Input contexts: ${JSON.stringify(inputContexts)}`
                        )
                    );
                    console.log(
                        colors.green(
                            `Output contexts: ${JSON.stringify(outputContexts)}`
                        )
                    );

                    if (response.endInteraction) {
                        console.log(colors.green(`End interaction`));
                        newSession = {
                            parameters: [],
                            inputContexts: [],
                            outputContexts: [],
                            parameters: [],
                        };
                    } else {
                        newSession = {
                            ...newSession,
                            inputContexts: utils.decreaseContexts(
                                utils.updateContexts(inputContexts)
                            ),
                            outputContexts: utils.decreaseContexts(
                                utils.updateContexts(outputContexts)
                            ),
                            lastIntent: response.intent,
                            parameters: parameters
                                ? parameters
                                : sessionParameters.parameters,
                        };
                    }

                    client.setex(sessionId, 1440, JSON.stringify(newSession));

                    console.log(`${"[AMUP]".yellow} Detected intent correctly`);

                    res.send(response);
                } else {
                    const response = await utils.detectIntent(
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
                                ? utils.updateContexts(inputContexts)
                                : inputContexts,
                        outputContexts:
                            outputContexts && outputContexts != []
                                ? utils.updateContexts(response.outputContexts)
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

    async train(req, res) {
        if (utils.verifyAuthentication(req, res)) {
            console.log(`${"[AMUP]".yellow} Bot is training`);
            try {
                const intents = await utils.readIntents();
                await utils.trainModel(intents);
                res.status(200).send({
                    status: "200",
                    message: "Bot is trained sucessfully",
                });
            } catch (error) {
                res.status(500).send({
                    status: "500",
                    message: "Bot is not trained",
                });
            }

            console.log(`${"[AMUP]".yellow} Bot is trained sucessfully`);
        }
    }
}

module.exports = new ModelController();
