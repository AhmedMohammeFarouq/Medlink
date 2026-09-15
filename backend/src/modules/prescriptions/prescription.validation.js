export const createPrescriptionValidation = (body) => {
    const errors = [];

    if (!body.patientId) {
        errors.push("Patient Health ID is required");
    }

    if (!body.medications || !Array.isArray(body.medications)) {
        errors.push("Medications must be an array");
    } else if (body.medications.length === 0) {
        errors.push("At least one medication is required");
    } else {
        body.medications.forEach((medication, index) => {
            if (!medication.medicationName) {
                errors.push(
                    `Medication ${index + 1}: Medication name is required`
                );
            }

            if (!medication.dosage) {
                errors.push(
                    `Medication ${index + 1}: Dosage is required`
                );
            }

            if (!medication.frequency) {
                errors.push(
                    `Medication ${index + 1}: Frequency is required`
                );
            }

            if (!medication.duration) {
                errors.push(
                    `Medication ${index + 1}: Duration is required`
                );
            }

            if (!medication.instructions) {
                errors.push(
                    `Medication ${index + 1}: Instructions are required`
                );
            }
        });
    }

    if (
        body.status !== undefined &&
        !["ACTIVE", "COMPLETED", "DISCONTINUED", "EXPIRED"].includes(body.status)
    ) {
        errors.push("Invalid prescription status");
    }

    if (
        body.issueDate !== undefined &&
        isNaN(Date.parse(body.issueDate))
    ) {
        errors.push("Invalid issue date");
    }

    return errors;
};

export const updatePrescriptionValidation = (body) => {
    const errors = [];

    if (body.status !== undefined) {
        if (
            !["ACTIVE", "COMPLETED", "DISCONTINUED", "EXPIRED"].includes(body.status)
        ) {
            errors.push("Invalid prescription status");
        }
    }

    if (body.issueDate !== undefined) {
        if (isNaN(Date.parse(body.issueDate))) {
            errors.push("Invalid issue date");
        }
    }

    if (body.expiresAt !== undefined && body.expiresAt !== null) {
        if (isNaN(Date.parse(body.expiresAt))) {
            errors.push("Invalid expiration date");
        }
    }

    if (body.notes !== undefined && typeof body.notes !== "string") {
        errors.push("Notes must be a string");
    }

    if (
        body.diagnosis !== undefined &&
        typeof body.diagnosis !== "string"
    ) {
        errors.push("Diagnosis must be a string");
    }

    return errors;
};