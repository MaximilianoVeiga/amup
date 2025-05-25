export default class Auth {
    username: string;
    password: string;

    constructor(auth: { username: string; password: string }) {
        this.username = auth.username;
        this.password = auth.password;
    }

    isValid(): boolean {
        return !!this.username && !!this.password;
    }

    static validateFields(req: any, fields: string[]): Array<{ field: string; message: string }> {
        const errors: Array<{ field: string; message: string }> = [];

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

    static getBearerToken(authorization: string): string {
        return authorization.split(" ")[1];
    }

    toJSON(): { username: string; password: string } {
        return {
            username: this.username,
            password: this.password,
        };
    }
}
