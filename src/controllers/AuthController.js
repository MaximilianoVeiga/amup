class AuthController {
	async signin(req, res) {
		const { username, password } = req.body;

		if (!username || !password) {
			return res.status(400).send({ error: 'You must provide an username and a password' });
		} else {
			if (username === process.env.USERNAME && password === process.env.PASSWORD) {
				const token = process.env.AUTH_TOKEN;

				return res.send({ accessToken: token });
			} else {
				return res.status(401).send({ error: 'Invalid username or password' });
			}
		}
	}
}

module.exports = new AuthController();