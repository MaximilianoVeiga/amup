import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Environment from "#config/Environment.js";
import Auth from "#models/Auth.js";

export default class AuthController {
    async signin(req, res) {
        const errors = Auth.validateFields(req, ["username", "password"]);

        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const { username, password } = req.body;

        try {
            const user = Environment.getUsername() === username ? true : false;

            if (!user) {
                return res
                    .status(401)
                    .json({ error: "Invalid username or password" });
            }

            const isMatch = bcrypt.compare(password, Environment.getPassword());

            if (!isMatch) {
                return res
                    .status(401)
                    .json({ error: "Invalid username or password" });
            }

            const token = jwt.sign({ username }, Environment.getAuthToken(), {
                expiresIn: 99000000000,
            });

            res.json({
                accessToken: token,
                requestDateTime: new Date().toISOString(),
                expiresIn: 99000000000,
            });
        } catch (error) {
            console.error(error);
            return res.sendStatus(500);
        }
    }
}
