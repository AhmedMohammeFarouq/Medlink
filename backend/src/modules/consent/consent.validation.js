export const createConsentValidation = (data) => {
    const errors = [];

    // patientId
    if (!data.patientId || typeof data.patientId !== "string" || !data.patientId.trim()) {
        errors.push("Patient ID is required");
    }

    // doctorId
    if (!data.doctorId || typeof data.doctorId !== "string" || !data.doctorId.trim()) {
        errors.push("Doctor ID is required");
    }

    // scope / accessLevel
    if (!data.scope || typeof data.scope !== "string" || !data.scope.trim()) {
        errors.push("Consent scope is required");
    }

    return errors;
};

export const consentIdValidation = (data) => {
    const errors = [];

    if (!data.id || typeof data.id !== "string" || !data.id.trim()) {
        errors.push("Consent ID is required");
    }

    return errors;
};