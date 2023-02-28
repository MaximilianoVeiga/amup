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

    static getBearerToken(authorization) {
        return authorization.split(" ")[1];
    }

    toJSON() {
        return {
            username: this.username,
            password: this.password,
        };
    }
}
