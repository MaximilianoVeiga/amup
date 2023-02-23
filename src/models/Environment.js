class Environment {
    static URL = process.env.URL || "localhost";
    static PORT = process.env.PORT || 3000;
    static USERNAME = process.env.USER || "admin";
    static PASSWORD = process.env.PASS || "admin";
    static AUTH_TOKEN = process.env.AUTH_TOKEN || "";
    static REDIS_IP = process.env.REDIS_IP || "localhost";
    static REDIS_PORT = process.env.REDIS_PORT || 6379;
    static WEBHOOK_URL =
        process.env.WEBHOOK_URL || "http://localhost:5000/fulfillment";
    static WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "";
    static WEBHOOK_ENABLED = process.env.WEBHOOK_ENABLED
        ? process.env.WEBHOOK_ENABLED.toLowerCase() === "true"
        : false;
    static TRAIN_ON_STARTUP = process.env.TRAIN_ON_STARTUP
        ? process.env.TRAIN_ON_STARTUP.toLowerCase() === "true"
        : false;
    static LANGUAGE = process.env.LANGUAGE || "br";

    static getURL() {
        return Environment.URL;
    }

    static getPort() {
        return Environment.PORT;
    }

    static getUsername() {
        return Environment.USERNAME;
    }

    static getPassword() {
        return Environment.PASSWORD;
    }

    static getAuthToken() {
        return Environment.AUTH_TOKEN;
    }

    static getRedisIP() {
        return Environment.REDIS_IP;
    }

    static getRedisPort() {
        return Environment.REDIS_PORT;
    }

    static getWebhookURL() {
        return Environment.WEBHOOK_URL;
    }

    static getWebhookSecret() {
        return Environment.WEBHOOK_SECRET;
    }

    static getWebhookEnabled() {
        return Environment.WEBHOOK_ENABLED;
    }

    static getTrainOnStartup() {
        return Environment.TRAIN_ON_STARTUP;
    }

    static getLanguage() {
        return Environment.LANGUAGE;
    }
}

module.exports = Environment;
