const colors = require("colors");

const Auth = require("../models/Auth");
const Model = require("../models/Model");

class ModelController {
    async train(req, res) {
        if (Auth.verify(req, res)) {
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
                console.error(`${"[AMUP]".yellow} Bot is not trained`);
            }
        }
    }
}

module.exports = new ModelController();
