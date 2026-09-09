export const createMedicationValidation = (data) => {
    const errors = [];

    // patientId
    if (!data.patientId || typeof data.patientId !== "string" || !data.patientId.trim()) {
        errors.push("Patient ID is required");
    }

    // name
    if (!data.name || typeof data.name !== "string" || !data.name.trim()) {
        errors.push("Medication name is required");
    }

    // dosage
    if (!data.dosage || typeof data.dosage !== "string" || !data.dosage.trim()) {
        errors.push("Dosage is required");
    }

    // frequency
    if (!data.frequency || typeof data.frequency !== "string" || !data.frequency.trim()) {
        errors.push("Frequency is required");
    }

    return errors;
};

export const medicationIdValidation = (data) => {
    const errors = [];

    if (!data.id || typeof data.id !== "string" || !data.id.trim()) {
        errors.push("Medication ID is required");
    }

    return errors;
};