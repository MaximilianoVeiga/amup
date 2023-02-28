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
        console.log(
            chalk.greenBright(`Session: `) + chalk.yellow(`${sessionId}`)
        );
        console.log(
            chalk.greenBright(`Intent: `) + chalk.yellow(`${intentDisplayName}`)
        );
        console.log(
            chalk.greenBright(`Input: `) + chalk.yellow(`${intentText}`)
        );
        console.log(
            chalk.greenBright(`Response: `) +
                chalk.yellow(`${JSON.stringify(responseMessages)}`)
        );
        console.log(
            chalk.greenBright(`Parameters: `) +
                chalk.yellow(`${JSON.stringify(parameters)}`)
        );
        console.log(
            chalk.greenBright(`Input contexts: `) +
                chalk.yellow(`${JSON.stringify(inputContexts)}`)
        );
        console.log(
            chalk.greenBright(`Output contexts: `) +
                chalk.yellow(`${JSON.stringify(outputContexts)}`)
        );
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
