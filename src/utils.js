const axios = require("axios");

async function sendWebhook(sessionId, intent, entities, messages, parameters) {
    const webhookUrl = process.env.WEBHOOK_URL;
    const webhookSecret = process.env.WEBHOOK_SECRET;

    const webhookPayload = {
        sessionId: sessionId,
        intent: intent,
        entities: entities,
        parameters: parameters,
        messages: messages,
    };
    const webhookHeaders = {
        "Content-Type": "application/json",
        Authorization: webhookSecret,
    };

    try {
        const response = await axios.post(webhookUrl, webhookPayload, {
            headers: webhookHeaders,
        });
        return response.data;
    } catch (error) {
        console.log(`${"[AMUP]".yellow} Webhook error`);
    }
}

module.exports = {
    sendWebhook,
};
