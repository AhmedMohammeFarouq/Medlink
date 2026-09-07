import { verifyAccessToken } from "../utils/token.utils.js";
import User from "../modules/users/user.model.js";

const authMiddleware = async (req, res, next) => {
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

        const user = await User.findById(decoded.userId);

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 401;
            throw error;
        }

        if (user.status === "DELETED") {
            const error = new Error("Account has been deleted");
            error.statusCode = 403;
            throw error;
        }

        if (user.status === "SUSPENDED") {
            const error = new Error("Account is suspended");
            error.statusCode = 403;
            throw error;
        }

        if (user.status !== "ACTIVE") {
            const error = new Error("Account is not active");
            error.statusCode = 403;
            throw error;
        }

        req.user = {
            userId: user._id,
            role: user.role,
        };

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