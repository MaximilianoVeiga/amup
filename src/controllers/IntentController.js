const utils = require("../utils");
const intentValidator = require("../validators/IntentCreateValidator");
const Intent = require('../models/Intent');

class IntentController {
	async index(req, res) {
		if (utils.verifyAuthentication(req, res)) {
			const intents = await utils.readIntents();
			res.send(intents);
		}
	}

	async create(req, res) {
		if (utils.verifyAuthentication(req, res)) {
			const reqIntent = req.body;

			try {
				const request = await intentValidator.validateAsync(reqIntent);
				const intents = await utils.readIntents();

				request.slug = utils.slugify(request.name);

				if (intents.find(i => i.slug === request.slug)) {
					console.log(`${'[AMUP]'.yellow} Intent already exists`);
					res.status(409).send({ "status": "409", "message": "Intent already exists" });
				} else {
					const intent = new Intent(request);

					if (intent.isValid()) {
						intents.push(intent);
						await utils.writeIntent(intent.toJSON(), request.slug);
						console.log(`${'[AMUP]'.yellow} Intent created`);
						res.status(201).send({ "status": "201", "message": "Intent created" });
						utils.train();
					}
				}
			}
			catch (err) {
				console.log(err);
				const payload = {
					status: "400",
					errors: err.details.map(e => e.message.replace(/\"/g, ""))
				}
				await res.status(400).send(payload);
			}
		}
	}

	// async update(req, res, next) {
	// }

	async destroy(req, res, next) {
		if (utils.verifyAuthentication(req, res)) {

			const reqIntent = req.query.intent;
			const intents = await utils.readIntents();

			if (!reqIntent) {
				console.log(`${'[AMUP]'.yellow} Intent not found`);
				res.status(404).send({ "status": "404" });
			}

			const intent = intents.find(i => i.name === reqIntent);

			if (intent) {
				utils.removeIntent(intent.slug);
				console.log(`${'[AMUP]'.yellow} Intent deleted`);
				res.status(200).send({ "status": "200" });
				utils.train();
			} else {
				console.log(`${'[AMUP]'.yellow} Intent not found`);
				res.status(404).send({ "status": "404" });
			}
		}
	}

}

module.exports = new IntentController();