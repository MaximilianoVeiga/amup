import chalk from "chalk";

export default class Text {
    static async removeMarkdown(text) {
        return text.replace(/(\*|_|`)/g, "");
    }

    static slugify(text) {
        return text
            .toString()
            .toLowerCase()
            .replace("intent", "") // Remove intent name
            .replace(/\s+/g, "-") // Replace spaces with -
            .replace(/[^\w-]+/g, "") // Remove all non-word chars
            .replace(/--+/g, "-") // Replace multiple - with single -
            .replace(/^-+/, "") // Trim - from start of text
            .replace(/-+$/, ""); // Trim - from end of text
    }

    static capitalizeFirstLetter(text) {
        if (text && typeof text === "string") {
            return text.charAt(0).toUpperCase() + text.slice(1);
        }
        return text;
    }

    static logMessage(message) {
        console.log(chalk.yellow(`[AMUP] `) + `${message}`);
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
        this.logField("Session", sessionId);
        this.logField("Intent", intentDisplayName);
        this.logField("Input", intentText);
        this.logField("Response", JSON.stringify(responseMessages));
        this.logField("Parameters", JSON.stringify(parameters));
        this.logField("Input contexts", JSON.stringify(inputContexts));
        this.logField("Output contexts", JSON.stringify(outputContexts));
    }

    static logField(field, value) {
        console.log(chalk.greenBright(`${field}: `) + chalk.yellow(`${value}`));
    }

    static logError(error) {
        console.log(chalk.yellow(`[AMUP] `) + chalk.red(`${error}`));
    }

    static formatName(name) {
        if (name && typeof name === "string") {
            if (name.includes(".")) {
                name = name.replace(/\./g, " ");
                name = name.replace(/(?:^|\s)\S/g, function (a) {
                    return a.toUpperCase();
                });
                return name;
            } else {
                return name;
            }
        } else {
            return name;
        }
    }
}
