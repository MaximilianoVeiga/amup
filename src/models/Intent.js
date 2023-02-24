const colors = require("colors");

const short = require("short-uuid");

class Intent {
    constructor(intent) {
        this.id = short.generate();
        this.name = intent.name;
        this.slug = intent.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .replace("Intent", "")
            .replace("intent", "");
        this.fallbackIntent = intent.fallbackIntent;
        this.endInteraction = intent.endInteraction;
        this.priority = 500000;
        this.utterances = intent.utterances;
        this.inputContexts = intent.inputContexts;
        this.outputContexts = intent.outputContexts;
        this.responses = intent.responses;
    }

    isValid() {
        return (
            this.name &&
            this.slug &&
            this.utterances &&
            this.utterances.length > 0 &&
            this.responses &&
            this.responses.length > 0
        );
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            slug: this.slug,
            fallbackIntent: this.fallbackIntent,
            endInteraction: this.endInteraction,
            priority: this.priority,
            utterances: this.utterances,
            inputContexts: this.inputContexts,
            outputContexts: this.outputContexts,
            responses: this.responses,
        };
    }

    static logData(
        sessionId,
        intentDisplayName,
        intentText,
        responseMessages,
        parameters,
        inputContexts,
        outputContexts
    ) {
        console.log(colors.green(`Session: ${sessionId}`));
        console.log(colors.green(`Intent: ${intentDisplayName}`));
        console.log(colors.green(`Input: ${intentText}`));
        console.log(
            colors.green(`Response: ${JSON.stringify(responseMessages)}`)
        );
        console.log(colors.green(`Parameters: ${JSON.stringify(parameters)}`));
        console.log(
            colors.green(`Input contexts: ${JSON.stringify(inputContexts)}`)
        );
        console.log(
            colors.green(`Output contexts: ${JSON.stringify(outputContexts)}`)
        );
    }
}

module.exports = Intent;
