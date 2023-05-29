import dotenv from "dotenv";
import path from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", ".env") });

import express from "express";

import bodyParser from "body-parser";
import cors from "cors";

const app = express();

import Environment from "#config/Environment.js";
import Model from "#models/Model.js";
import Text from "#models/Text.js";

const trainOnStartup = Environment.getTrainOnStartup();

if (trainOnStartup) {
    Model.train();
}

app.use(bodyParser.json());
app.use(cors());

const url = process.env.URL || "localhost";
const port = process.env.PORT || 3000;

import authRouter from "#routes/auth.routes.js";
import healthRouter from "#routes/health.routes.js";
import intentRouter from "#routes/intent.routes.js";
import modelRouter from "#routes/model.routes.js";

import pkg from "../package.json" assert { type: "json" };
const packageVersion = pkg.version;

app.use("/api", authRouter);
app.use("/api", healthRouter);
app.use("/api", intentRouter);
app.use("/", modelRouter);

app.get("/", (req, res) => {
    res.send({
        name: "[AMUP] - Artifical Machine Understanding Platform - API",
        version: packageVersion,
    });
});

app.listen(port, () => {
    Text.logMessage(`Server is running on http://${url}:${port}`);
});
