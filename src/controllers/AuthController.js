class AuthController {
    async signin(req, res) {
        const { username, password } = req.body;

        let errors = [];

        if (!username) {
            errors.push({
                field: "username",
                message: "You must provide an username",
            });
        }

        if (!password) {
            errors.push({
                field: "password",
                message: "You must provide a password",
            });
        }

        if (errors.length > 0) {
            return res.status(400).send({
                errors,
            });
        } else {
            if (
                username === process.env.user &&
                password === process.env.pass
            ) {
                const token = process.env.AUTH_TOKEN;

                return res.send({
                    accessToken: token,
                    requestDateTime: new Date().toISOString(),
                    expiresIn: 3600000,
                });
            } else {
                return res
                    .status(401)
                    .send({ error: "Invalid username or password" });
            }
        }
    }
}

module.exports = new AuthController();
