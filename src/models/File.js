const path = require("path");
const fs = require("fs");

const intentDir = path.join(__dirname, "../agent/intents");
const modelDir = path.join(__dirname, "../agent/data");
const baseDir = path.join(__dirname, "../../");

class File {
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

        return intents.find(intent => intent.slug === slug);
    }

    static async readIntents() {
        return fs
            .readdirSync(intentDir)
            .filter(name => path.extname(name) === ".json")
            .map(name => require(path.join(intentDir, name)));
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

module.exports = File;
