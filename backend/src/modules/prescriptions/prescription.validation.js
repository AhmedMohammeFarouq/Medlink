const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
};

export const createPrescriptionValidation = (body) => {
    const errors = [];

    if (!body.patientId) {
        errors.push("Patient ID is required");
    } else if (!isValidObjectId(body.patientId)) {
        errors.push("Invalid patient ID");
    }

    if (!body.doctorId) {
        errors.push("Doctor ID is required");
    } else if (!isValidObjectId(body.doctorId)) {
        errors.push("Invalid doctor ID");
    }

    if (!body.createdBy) {
        errors.push("Created by is required");
    } else if (!isValidObjectId(body.createdBy)) {
        errors.push("Invalid created by ID");
    }

    if (!body.medications || !Array.isArray(body.medications)) {
        errors.push("Medications must be an array");
    } else if (body.medications.length === 0) {
        errors.push("At least one medication is required");
    } else {
        body.medications.forEach((medication, index) => {
            if (!medication.medicationId) {
                errors.push(
                    `Medication ${index + 1}: Medication ID is required`
                );
            } else if (!isValidObjectId(medication.medicationId)) {
                errors.push(
                    `Medication ${index + 1}: Invalid medication ID`
                );
            }
        });
    }

    if (
        body.status !== undefined &&
        !["ACTIVE", "COMPLETED", "EXPIRED", "CANCELLED"].includes(
            body.status
        )
    ) {
        errors.push("Invalid prescription status");
    }

    if (body.expiresAt !== undefined && body.expiresAt !== null) {
        if (isNaN(Date.parse(body.expiresAt))) {
            errors.push("Invalid expiration date");
        }
    }

    return errors;
};
export const updatePrescriptionValidation = (body) => {
    const errors = [];

    if (body.status !== undefined) {
        if (
            ![
                "ACTIVE",
                "COMPLETED",
                "EXPIRED",
                "CANCELLED",
            ].includes(body.status)
        ) {
            errors.push("Invalid prescription status");
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

    if (body.diagnosis !== undefined) {
        if (!Array.isArray(body.diagnosis)) {
            errors.push("Diagnosis must be an array");
        }
    }

    return errors;
};