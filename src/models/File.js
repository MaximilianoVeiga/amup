import fs from "fs";
import path from "path";
import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const intentDir = path.join(__dirname, "../agent/intents");
const modelDir = path.join(__dirname, "../agent/data");
const baseDir = path.join(__dirname, "../../");

export default class File {
    static async writeIntent(intent, fileName) {
        const json = JSON.stringify(intent);
        const intentPath = path.join(intentDir, fileName + ".json");
        fs.writeFileSync(intentPath, json, "utf8", err => {
            if (err) {
                console.error(err);
            }
        });
    }

    static getModel(modelName = "model.nlp") {
        const modelPath = path.join(modelDir, modelName);
        return modelPath;
    }

    static removeModel(modelName = "model.nlp") {
        const modelPath = path.join(modelDir, modelName);
        if (fs.existsSync(modelPath)) {
            fs.unlinkSync(modelPath);
        }
    }

    static removeBaseModel(modelName = "model.nlp") {
        const baseModelPath = path.join(baseDir, modelName);
        if (fs.existsSync(baseModelPath)) {
            fs.unlinkSync(baseModelPath);
        }
    }

    static async removeIntent(fileName) {
        const intentPath = path.join(intentDir, fileName + ".json");
        if (fs.existsSync(intentPath)) {
            fs.unlink(intentPath, err => {
                if (err) throw err;
            });
            return true;
        } else {
            return false;
        }
    }

    static async getIntent(slug) {
        const intents = await File.readIntents();
        for (const intent of intents) {
            if (intent && intent.slug === slug) {
                return intent;
            }
        }
        return null;
    }

    static async readIntents() {
        try {
            const promises = fs
                .readdirSync(intentDir)
                .filter(name => path.extname(name) === ".json")
                .map(name =>
                    import(File.buildUrl(intentDir, name), {
                        assert: { type: "json" },
                    })
                );

            const intents = await Promise.all(promises);
            const finalData = intents.map(intent => intent.default);
            return finalData;
        } catch (error) {
            console.error(error);
        }
    }

    static buildUrl(intentDir, name) {
        const filePath = path.join(intentDir, name);

        return `file://${filePath}`;
    }

    static createDataFolder() {
        if (!fs.existsSync(modelDir)) {
            fs.mkdirSync(modelDir);
            return true;
        }
        return false;
    }

    static async verifyModel(modelName) {
        const modelPath = path.join(modelDir, modelName);

        if (fs.existsSync(modelPath)) {
            return true;
        }
        return false;
    }
}
