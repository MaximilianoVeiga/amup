class Auth {
    constructor(auth) {
        this.username = auth.username;
        this.password = auth.password;
    }

    isValid() {
        return this.username && this.password;
    }

    static verify(req, res) {
        const bearerHeader =
            req.headers["Authorization"] || req.headers["authorization"];

        if (bearerHeader) {
            const bearer = bearerHeader.split(" ");
            const bearerToken = bearer[1];

            if (bearerToken === process.env.AUTH_TOKEN) {
                return true;
            } else {
                res.status(403).send({
                    code: 403,
                    message: "Forbidden",
                });
                return false;
            }
        } else {
            res.status(401).send({
                code: 401,
                message: "Unauthorized",
            });
            return false;
        }
    }

    toJSON() {
        return {
            username: this.username,
            password: this.password,
        };
    }
}

module.exports = Auth;
