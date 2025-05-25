import fs from "fs";
import path from "path";
import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const intentDir = path.join(__dirname, "../Agent/Intents");
const modelDir = path.join(__dirname, "../Agent/Models");
const baseDir = path.join(__dirname, "../../");

export default class File {
    static async writeIntent(intent: unknown, fileName: string): Promise<void> {
        const json = JSON.stringify(intent);
        const intentPath = path.join(intentDir, fileName + ".json");
        fs.writeFileSync(intentPath, json, "utf8", err => {
            if (err) {
                console.error(err);
            }
        });
    }

    static getModel(modelName = "model.nlp"): string {
        const modelPath = path.join(modelDir, modelName);
        return modelPath;
    }

    static removeModel(modelName = "model.nlp"): void {
        const modelPath = path.join(modelDir, modelName);
        if (fs.existsSync(modelPath)) {
            fs.unlinkSync(modelPath);
        }
    }

    static removeBaseModel(modelName = "model.nlp"): void {
        const baseModelPath = path.join(baseDir, modelName);
        if (fs.existsSync(baseModelPath)) {
            fs.unlinkSync(baseModelPath);
        }
    }

    static async removeIntent(fileName: string): Promise<boolean> {
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

    static async getIntent(slug: string): Promise<any | null> {
        const intents = await File.readIntents();
        for (const intent of intents) {
            if (intent && intent.slug === slug) {
                return intent;
            }
        }
        return null;
    }

    static async readIntents(): Promise<any[]> {
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

    static buildUrl(intentDir: string, name: string): string {
        const filePath = path.join(intentDir, name);

        return `file://${filePath}`;
    }

    static createDataFolder(): boolean {
        if (!fs.existsSync(modelDir)) {
            fs.mkdirSync(modelDir);
            return true;
        }
        return false;
    }

    static async verifyModel(modelName: string): Promise<boolean> {
        const modelPath = path.join(modelDir, modelName);

        if (fs.existsSync(modelPath)) {
            return true;
        }
        return false;
    }
}
