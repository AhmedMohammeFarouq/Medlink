export const createDocumentValidation = (req, res, next) => {
    const data = req.body || {};
    const errors = [];

    // patientId / patient
    const patientId = data.patientId || data.patient;
    if (!patientId || typeof patientId !== "string" || !patientId.trim()) {
        errors.push("Patient ID is required");
    }

    // title / name
    const title = data.title || data.name;
    if (!title || typeof title !== "string" || !title.trim()) {
        errors.push("Document title is required");
    }

    // documentType / type
    const type = data.documentType || data.type;
    if (!type || typeof type !== "string" || !type.trim()) {
        errors.push("Document type is required");
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

export const documentIdValidation = (req, res, next) => {
    const id = req.params.id || req.body.id;
    const errors = [];

    if (!id || typeof id !== "string" || !id.trim()) {
        errors.push("Document ID is required");
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