const validationMiddleware = (validationFunction) => {
    return (req, res, next) => {
        const errors = validationFunction(
            req.body,
            req.file,
            req.params,
            req
        );

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: errors.join(", ") || "Validation failed",
                errors,
            });
        }

        next();
    };
};

export default validationMiddleware;