export const createMedicationValidation = (req, res, next) => {
    const data = req.body || {};
    const errors = [];

    // patientId / patient
    const patientId = data.patientId || data.patient;
    if (!patientId || typeof patientId !== "string" || !patientId.trim()) {
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

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors,
        });
    }

    next();
};

export const medicationIdValidation = (req, res, next) => {
    // يفحص الـ id من الـ params أو الـ body
    const id = req.params.id || req.body.id;
    const errors = [];

    if (!id || typeof id !== "string" || !id.trim()) {
        errors.push("Medication ID is required");
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors,
        });
    }

    next();
};