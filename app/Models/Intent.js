import short from "short-uuid";

export default class Intent {
    constructor(intent) {
        this.id = intent.id ? intent.id : short.generate();
        this.name = intent.name;
        this.slug = intent.slug;
        this.fallbackIntent = intent.fallbackIntent;
        this.endInteraction = intent.endInteraction;
        this.priority = 500000;
        this.utterances = intent.utterances;
        this.inputContexts = intent.inputContexts;
        this.outputContexts = intent.outputContexts;
        this.responses = intent.responses;
    }

    isValid() {
        return this.name &&
            this.slug &&
            this.utterances &&
            this.utterances.length > 0 &&
            this.responses &&
            this.responses.length > 0
            ? true
            : false;
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
}
