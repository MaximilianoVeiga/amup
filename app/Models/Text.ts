import chalk from "chalk";

export default class Text {
    static async removeMarkdown(text: string): Promise<string> {
        return text.replace(/(\*|_|`)/g, "");
    }

    static slugify(text: string): string {
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

    static capitalizeFirstLetter(text: string): string {
        if (text && typeof text === "string") {
            return text.charAt(0).toUpperCase() + text.slice(1);
        }
        return text;
    }

    static logMessage(message: string): void {
        console.log(chalk.yellow(`[AMUP] `) + `${message}`);
    }

    static logData(
        sessionId: string,
        intentDisplayName: string,
        intentText: string,
        responseMessages: unknown[],
        parameters: Record<string, unknown>,
        inputContexts: unknown[],
        outputContexts: unknown[]
    ): void {
        this.logField("Session", sessionId);
        this.logField("Intent", intentDisplayName);
        this.logField("Input", intentText);
        this.logField("Response", JSON.stringify(responseMessages));
        this.logField("Parameters", JSON.stringify(parameters));
        this.logField("Input contexts", JSON.stringify(inputContexts));
        this.logField("Output contexts", JSON.stringify(outputContexts));
    }

    static logField(field: string, value: string): void {
        console.log(chalk.greenBright(`${field}: `) + chalk.yellow(`${value}`));
    }

    static logError(error: unknown): void {
        console.log(chalk.yellow(`[AMUP] `) + chalk.red(`${error}`));
    }

    static formatName(name: string): string {
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
