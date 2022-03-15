const utils = require("../utils");

class IntentController {
    async intents(req, res) {
        if (utils.verifyAuthentication(req, res)) {
            const intents = await utils.readIntents();
            res.send(intents);
        }
    }
    
}

module.exports = new IntentController();