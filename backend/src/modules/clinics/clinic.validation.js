export const validateCreateClinic = (body) => {
    const errors = [];
    if (!body?.name) errors.push("Clinic name is required");
    return errors;
};

export default {
    validateCreateClinic,
};
