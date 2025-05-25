import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import Environment from "#config/Environment.js";
import Auth from "#models/Auth.js";
import Text from "#models/Text.js";

export default class AuthMiddleware {
    validateAuthToken(req: Request, res: Response, next: NextFunction): void {
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
