export const validateMedicalRecordUpdate = (body = {}) => {
    const errors = [];

    if (body.allergies && !Array.isArray(body.allergies)) {
        errors.push("allergies must be an array");
    }

    if (body.chronicConditions && !Array.isArray(body.chronicConditions)) {
        errors.push("chronicConditions must be an array");
    }

    return errors;
};

export const validateAllergy = (body = {}) => {
    const errors = [];

    if (!body.name) {
        errors.push("name is required");
    }

    return errors;
};
