import redis from "redis";

export default class RedisDAO {
    constructor() {
        this.redisConfig = {
            host: process.env.REDIS_IP,
            port: process.env.REDIS_PORT,
        };
    }

    async connect() {
        try {
            const client = redis.createClient(this.redisConfig);

            client.on("error", error => {
                client.quit();
                throw new Error(`Connection to Redis: ${error.message}`);
            });

            await new Promise(resolve => client.on("ready", resolve));

            return client;
        } catch (error) {
            throw new Error(`Connection to Redis: ${error.message}`);
        }
    }
}
