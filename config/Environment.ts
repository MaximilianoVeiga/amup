export default class Environment {
    static getURL(): string | undefined {
        return process.env.URL;
    }

    static getPort(): string | undefined {
        return process.env.PORT;
    }

    static getUsername(): string | undefined {
        return process.env.USER;
    }

    static getPassword(): string | undefined {
        return process.env.PASS;
    }

    static getAuthToken(): string | undefined {
        return process.env.AUTH_TOKEN;
    }

    static getRedisIP(): string | undefined {
        return process.env.REDIS_IP;
    }

    static getRedisPort(): string | undefined {
        return process.env.REDIS_PORT;
    }

    static getWebhookURL(): string | undefined {
        return process.env.WEBHOOK_URL;
    }

    static getWebhookSecret(): string | undefined {
        return process.env.WEBHOOK_SECRET;
    }

    static getWebhookEnabled(): string | undefined {
        return process.env.WEBHOOK_ENABLED;
    }

    static getTrainOnStartup(): boolean | undefined {
        return process.env.TRAIN_ON_STARTUP;
    }

    static getLanguage(): string | undefined {
        return process.env.LANGUAGE;
    }

    static getThreshold(): number | undefined {
        return process.env.NLU_TRESHOLD;
    }
}
