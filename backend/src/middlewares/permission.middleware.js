import { ROLE_PERMISSIONS } from "../constants/role-permissions.js";

const permissionMiddleware = (...requiredPermissions) => {
    return (req, res, next) => {
        if (!req.user) {
            const error = new Error("Authentication required");
            error.statusCode = 401;
            return next(error);
        }

        const userPermissions =
            ROLE_PERMISSIONS[req.user.role] || [];

        const hasAllPermissions = requiredPermissions.every(
            (permission) => userPermissions.includes(permission)
        );

        if (!hasAllPermissions) {
            const error = new Error("Access denied");
            error.statusCode = 403;
            return next(error);
        }

        next();
    };
};

export default permissionMiddleware;