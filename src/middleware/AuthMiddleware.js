import jwt from "jsonwebtoken";

import Auth from "../models/Auth.js";
import Environment from "../models/Environment.js";
import Text from "../models/Text.js";

export default class AuthMiddleware {
    validateAuthToken(req, res, next) {
        const token = req.headers.authorization;

        if (!token) {
            return res
                .status(401)
                .send({ code: 401, message: "Missing authentication token" });
        }

        try {
            const bearer = Auth.getBearerToken(token);
            const decodedToken = jwt.verify(bearer, Environment.getAuthToken());

            req.user = decodedToken.user;

            next();
        } catch (error) {
            Text.logError(error);
            return res
                .status(401)
                .send({ code: 401, message: "Invalid authentication token" });
        }
    }
}
