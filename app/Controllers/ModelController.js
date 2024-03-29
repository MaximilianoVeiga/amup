import Model from "../Models/Model.js";

export default class ModelController {
    async train(req, res) {
        try {
            await Model.train();
            res.status(200).send({
                status: "200",
                message: "Bot is trained sucessfully",
            });
        } catch (error) {
            res.status(500).send({
                status: "500",
                message: "Bot is not trained",
            });
            Text.logMessage("Bot is not trained");
        }
    }
}
