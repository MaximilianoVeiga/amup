import jwt from "jsonwebtoken";

export default class AuthMiddleware {
    validateAuthToken(req, res, next) {
        const token = req.headers.authorization;

        if (!token) {
            return res
                .status(401)
                .send({ error: "Missing authentication token" });
        }

        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decodedToken.user;
            next();
        } catch (error) {
            return res
                .status(401)
                .send({ error: "Invalid authentication token" });
        }
    }
}
