import short from "short-uuid";

import Environment from "#config/Environment.js";
import Context from "#models/Context.js";
import Entity from "#models/Entity.js";
import File from "#models/File.js";
import Text from "#models/Text.js";

import { NlpManager } from "@horizon-rs/node-nlp";

const language = Environment.getLanguage();

import utils from "../utils.js";
import type { IntentProps } from "./Intent.js";

export default class Model {
    static async trainModel(intents: IntentProps[]): Promise<void> {
        const manager = new NlpManager({
            languages: [language],
            forceNER: true,
            nlu: { log: false },
            autoSave: true,
            threshold: Environment.getThreshold(),
        });

        const intentsByContext = Context.groupIntents(intents);

        for (const context in intentsByContext) {
            const contextManager = new NlpManager({
                languages: [language],
                forceNER: true,
                nlu: { log: false },
                autoSave: true,
                threshold: Environment.getThreshold(),
            });

            const intentsInContext = intentsByContext[context].intents;

            for (const intent of intentsInContext) {
                for (const phrase of intent.utterances) {
                    contextManager.addDocument(language, phrase, intent.slug);
                }

                Model.addResponses(intent, intent.slug, contextManager);
            }

            await Model.save(contextManager, `model-${context}.nlp`);
        }

        const entities = Entity.seed();

        for (const entity of entities) {
            manager.addNamedEntityText(
                entity.type,
                entity.name,
                language,
                entity.data
            );
        }

        for (const intent of intents) {
            const intentSlug = intent.slug;
            const intentDomain = intent.domain;
            const intentContext = intent.inputContexts;

            if (intentContext && intentContext.length === 0) {
                if (intentDomain) {
                    manager.assignDomain(language, intentSlug, intentDomain);
                }

                for (const phrase of intent.utterances) {
                    manager.addDocument(language, phrase, intentSlug);
                }

                if (intent.entities) {
                    for (const entity of intent.entities) {
                        manager.addNamedEntityText(
                            entity.type,
                            entity.name,
                            language,
                            entity.phrases
                        );
                    }
                }

                Model.addResponses(intent, intentSlug, manager);
            }
        }

        await Model.save(manager, "model.nlp");
    }

    static async addResponses(intent, intentSlug, manager) {
        intent.responses.map(response => {
            response.message.map(message => {
                if (message.type === "message") {
                    if (message.text.length > 0) {
                        for (const text of message.text) {
                            manager.addAnswer(language, intentSlug, text);
                        }
                    } else {
                        manager.addAnswer(
                            language,
                            intentSlug,
                            message.text[0]
                        );
                    }
                }
            });
        });

        return manager;
    }

    static async detect(
        query: string,
        sessionId: string | null = null,
        model: string = "model.nlp",
        parameters?: Record<string, unknown>
    ): Promise<any> {
        const modelPath = File.getModel(model);

        const modelIsValid = await File.verifyModel(model);

        if (!modelIsValid) {
            await Model.trainModel(await File.readIntents());
        }

        Text.logMessage("Bot is detecting intent");

        const manager = new NlpManager({
            languages: [language],
            forceNER: true,
            nlu: { log: false },
        });

        try {
            manager.load(modelPath);

            const input = await Text.removeMarkdown(query);

            const nluResponse = await manager.process(language, input);
            const response = Model.makeResponse(
                nluResponse,
                sessionId,
                parameters
            );

            return response;
        } catch (error) {
            Text.logMessage("Bot is not loaded");

            throw error;
        }
    }

    static async train(): Promise<void> {
        try {
            Text.logMessage("Bot is training");

            const intents = await File.readIntents();
            await Model.trainModel(intents);
            Text.logMessage("Bot is trained sucessfully");
        } catch (error) {
            Text.logMessage("Bot is not trained");

            Text.logError(error);
        }
    }

    static async save(manager: any, modelName: string): Promise<void> {
        const fileName = File.getModel(modelName);

        File.removeModel(modelName);

        try {
            await manager.train();
            await manager.save(fileName);
            File.removeBaseModel();
        } catch (error) {
            Text.logMessage("Bot is not saved");

            throw error;
        }
    }

    static async makeResponse(
        response: any,
        sessionId: string | null = null,
        parameters?: Record<string, unknown>
    ): Promise<any> {
        const intentData = await File.getIntent(response.intent);

        const entities = response.entities.map(entity => {
            const entityValue =
                entity && entity.resolution && entity.resolution.value
                    ? entity?.resolution?.value
                    : entity.option;
            const entitySource = entity.utteranceText
                ? entity.utteranceText
                : entity.type;

            return {
                entityType: entity.entity,
                value: entityValue,
                source: entitySource,
                confidence: entity.accuracy,
            };
        });

        if (parameters && parameters.name) {
            parameters.name = Text.formatName(parameters.name);
        }

        let newEntitiesCreated = {};

        entities.map(entity => {
            if (entity.entityType === "time") {
                newEntitiesCreated[entity.entityType] = entity.source;
            }
        });

        parameters = {
            ...parameters,
            ...newEntitiesCreated,
        };

        const intent = {
            isFallback: response.intent === "None" ? true : false,
            displayName:
                intentData.name === "None" ? "Fallback" : intentData.name,
            endInteraction: intentData.endInteraction,
            id: short.generate(),
        };

        const sentiment = {
            queryTextSentiment: {
                score: response.sentiment.score,
                type: response.sentiment.type,
                vote: response.sentiment.vote,
            },
        };

        let messages = [];
        let suggestions = [];
        let blocks = [];

        intentData.responses.map(response => {
            const message = response.message[0];
            const messageText = message.text;

            if (message.type === "message") {
                let messageVariation = [];

                if (messageText.length > 1) {
                    const random =
                        Math.floor(
                            Math.random() * (messageText.length - 1 + 1) + 1
                        ) - 1;

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

            if (message.type === "block") {
                blocks.push(message.payload);
            }

            for (let i = 0; i < messages.length; i++) {
                if (i === messages.length - 1) {
                    if (suggestions.length > 0) {
                        messages[i].suggestions = suggestions[0];
                    }
                }
            }

            messages.map(message => {
                if (message.text && parameters) {
                    for (const [key, value] of Object.entries(parameters)) {
                        message.text = message.text.replace(
                            new RegExp(`\\$${key}`, "g"),
                            value
                        );
                    }
                }
            });
        });

        const webhookEnabled = intentData.webhookUsed;

        const webhook = {
            webhookUsed: webhookEnabled,
        };

        let payload = {
            id: sessionId ? sessionId : short.generate(),
            endInteraction: intent.endInteraction,
            fulfillmentText: messages.length === 1 ? messages[0].text : "",
            utterance: response.utterance,
            languageCode: response.localeIso2,
            confidence: response.score,
            entities: entities,
            webhook: webhook,
            parameters: parameters,
            inputContexts: intentData.inputContexts || [],
            outputContexts: intentData.outputContexts || [],
            messages: messages,
            sentimentAnalysisResult: sentiment,
            intent: intent,
        };

        if (blocks && blocks[0]) {
            payload.blocks = blocks[0];
        }

        if (webhookEnabled) {
            const webhookResponse = await utils.sendWebhook(
                sessionId,
                intent,
                entities,
                messages,
                parameters
            );
            payload.messages =
                webhookResponse && webhookResponse.messages
                    ? webhookResponse.messages
                    : [];

            return payload;
        }

        return payload;
    }
}
