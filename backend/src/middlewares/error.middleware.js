import { errorResponse } from "../utils/apiResponse.js";

const errorMiddleware = (err, req, res, next) => {
    console.error(err);

    // Mongoose Validation Error
    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map(
            (error) => error.message
        );

        return errorResponse({
            res,
            statusCode: 400,
            message: "Validation failed",
            errors,
        });
    }

    // MongoDB Duplicate Key Error
    if (err.code === 11000) {
        const duplicatedField = Object.keys(err.keyValue || {});

        const errors = duplicatedField.map(
            (field) => `${field} already exists`
        );

        return errorResponse({
            res,
            statusCode: 409,
            message: "Duplicate data",
            errors,
        });
    }

    // Custom Application Error
    return errorResponse({
        res,
        statusCode: err.statusCode || 500,
        message: err.message || "Internal Server Error",
    });
};

export default errorMiddleware;