export const uploadDocumentValidation = (data) => {
    const errors = [];

    // patientId
    if (!data.patientId || typeof data.patientId !== "string" || !data.patientId.trim()) {
        errors.push("Patient ID is required");
    }

    // title
    if (!data.title || typeof data.title !== "string" || !data.title.trim()) {
        errors.push("Document title is required");
    }

    return errors;
};

export const documentIdValidation = (data) => {
    const errors = [];

    if (!data.id || typeof data.id !== "string" || !data.id.trim()) {
        errors.push("Document ID is required");
    }

    return errors;
};