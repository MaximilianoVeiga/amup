class Context {
    static getName(context) {
        let path = "./src/agent/data/model.nlp";
        if (context && context.name) {
            const contextName = context.name;
            path = `./src/agent/data/model-${contextName}.nlp`;
        }
        return path;
    }

    static decrease(contexts) {
        const contextsToDecrease = contexts.filter(
            context => context.lifespanCount > 1
        );

        const newContexts = contextsToDecrease.map(context => {
            context.lifespanCount = context.lifespanCount - 1;

            return context;
        });

        return newContexts;
    }

    static group(contexts) {
        if (contexts.length === 0) {
            return [];
        }

        const groupedContexts = {};

        contexts.map(context => {
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

    static update(contexts) {
        const groupedContexts = Context.group(contexts);
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

    static groupIntents(intents) {
        const groupedIntents = {};
        intents.map(intent => {
            const intentId = intent.id;
            const intentContext = intent.inputContexts;

            if (intentContext && intentContext.length > 0) {
                intent.inputContexts.map(context => {
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
}

module.exports = Context;
