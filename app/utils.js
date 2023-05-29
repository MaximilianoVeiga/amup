import axios from "axios";

async function sendWebhook(sessionId, intent, entities, messages, parameters) {
    const webhookUrl = process.env.WEBHOOK_URL;
    const webhookSecret = process.env.WEBHOOK_SECRET;

    const webhookPayload = {
        sessionId,
        intent,
        entities,
        parameters,
        messages,
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
        Text.logMessage("Webhook error");
    }
}

export default {
    sendWebhook,
};
