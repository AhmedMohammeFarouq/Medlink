export const validateCreateDoctor = (body) => {
    const errors = [];
    if (!body?.userId) errors.push("User ID is required");
    return errors;
};

export default {
    validateCreateDoctor,
};
