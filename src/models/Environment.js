export default class Environment {
    static getURL() {
        return process.env.URL;
    }

    static getPort() {
        return process.env.PORT;
    }

    static getUsername() {
        return process.env.USER;
    }

    static getPassword() {
        return process.env.PASS;
    }

    static getAuthToken() {
        return process.env.AUTH_TOKEN;
    }

    static getRedisIP() {
        return process.env.REDIS_IP;
    }

    static getRedisPort() {
        return process.env.REDIS_PORT;
    }

    static getWebhookURL() {
        return process.env.WEBHOOK_URL;
    }

    static getWebhookSecret() {
        return process.env.WEBHOOK_SECRET;
    }

    static getWebhookEnabled() {
        return process.env.WEBHOOK_ENABLED;
    }

    static getTrainOnStartup() {
        return process.env.TRAIN_ON_STARTUP;
    }

    static getLanguage() {
        return process.env.LANGUAGE;
    }
}
