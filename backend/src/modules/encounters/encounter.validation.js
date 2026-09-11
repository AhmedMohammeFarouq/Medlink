export const validateCreateEncounter = (body = {}) => {
    const errors = [];

    if (!body.patientId) errors.push("patientId is required");
    if (!body.doctorId) errors.push("doctorId is required");

    return errors;
};

export const validateUpdateStatus = (body = {}) => {
    const errors = [];
    const validStatuses = ["OPEN", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

    if (!body.status || !validStatuses.includes(body.status)) {
        errors.push("status must be one of: " + validStatuses.join(", "));
    }

    return errors;
};
