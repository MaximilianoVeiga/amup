import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Auth from "../models/Auth.js";
import Environment from "../models/Environment.js";

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

            console.log(Environment.getPassword());
            console.log(password);
            console.log(process.env.PASS || "admin");

            console.log(bcrypt.compare(password, Environment.getPassword()));

            const isMatch = await bcrypt.compare(
                password,
                Environment.getPassword()
            );

            if (!isMatch) {
                return res
                    .status(401)
                    .json({ error: "Invalid username or password" });
            }

            const token = jwt.sign({ username }, Environment.getAuthToken(), {
                expiresIn: "1h",
            });

            res.json({
                accessToken: token,
                requestDateTime: new Date().toISOString(),
                expiresIn: 3600000,
            });
        } catch (error) {
            console.error(error);
            return res.sendStatus(500);
        }
    }
}
