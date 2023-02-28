export default class HealthController {
    async show(req, res) {
        res.status(200).send({
            status: "ON",
        });
    }
}
