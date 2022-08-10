class Auth {
	constructor(auth) {
		this.username = auth.username;
		this.password = auth.password;

	}

	isValid() {
		return this.username && this.password;
	}

	toJSON() {
		return {
			username: this.username,
			password: this.password
		}
	}
}

module.exports = Auth;