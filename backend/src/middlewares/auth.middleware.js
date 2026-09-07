import { verifyAccessToken } from "../utils/token.utils.js";

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            const error = new Error("Authentication required");
            error.statusCode = 401;
            throw error;
        }

        const [scheme, token] = authHeader.split(" ");

        if (scheme !== "Bearer" || !token) {
            const error = new Error("Invalid authorization format");
            error.statusCode = 401;
            throw error;
        }

        const decoded = verifyAccessToken(token);

        req.user = decoded;

        next();
    } catch (error) {
        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError"
        ) {
            error.statusCode = 401;
            error.message = "Invalid or expired access token";
        }

        next(error);
    }
};

export default authMiddleware;