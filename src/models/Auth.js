import Environment from "../models/Environment.js";

export default class Auth {
    constructor(auth) {
        this.username = auth.username;
        this.password = auth.password;
    }

    isValid() {
        return this.username && this.password;
    }

    static validateFields(req, fields) {
        const errors = [];

        fields.forEach(field => {
            if (!req.body[field]) {
                errors.push({
                    field,
                    message: `You must provide a ${field}`,
                });
            }
        });

        return errors;
    }

    static verify(req, res) {
        const bearerHeader =
            req.headers["Authorization"] || req.headers["authorization"];

        if (bearerHeader) {
            const bearer = bearerHeader.split(" ");
            const bearerToken = bearer[1];

            if (bearerToken === Environment.getAuthToken()) {
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
