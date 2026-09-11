const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
};

export const createAppointmentValidation = (body) => {
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

    if (!body.clinicId) {
        errors.push("Clinic ID is required");
    } else if (!isValidObjectId(body.clinicId)) {
        errors.push("Invalid clinic ID");
    }

    if (!body.scheduledAt) {
        errors.push("Scheduled date and time are required");
    } else if (isNaN(Date.parse(body.scheduledAt))) {
        errors.push("Invalid scheduled date and time");
    }

    if (body.duration !== undefined) {
        if (
            !Number.isInteger(body.duration) ||
            body.duration < 1
        ) {
            errors.push("Duration must be a positive integer");
        }
    }

    if (
        body.type !== undefined &&
        !["IN_PERSON", "ONLINE", "FOLLOW_UP"].includes(body.type)
    ) {
        errors.push("Invalid appointment type");
    }

    return errors;
};
export const updateAppointmentValidation = (body) => {
    const errors = [];

    if (body.scheduledAt !== undefined) {
        if (isNaN(Date.parse(body.scheduledAt))) {
            errors.push("Invalid scheduled date and time");
        }
    }

    if (body.duration !== undefined) {
        if (
            !Number.isInteger(body.duration) ||
            body.duration < 1
        ) {
            errors.push("Duration must be a positive integer");
        }
    }

    if (
        body.type !== undefined &&
        !["IN_PERSON", "ONLINE", "FOLLOW_UP"].includes(body.type)
    ) {
        errors.push("Invalid appointment type");
    }

    if (
        body.status !== undefined &&
        ![
            "PENDING",
            "CONFIRMED",
            "COMPLETED",
            "CANCELLED",
            "NO_SHOW",
            "RESCHEDULED",
        ].includes(body.status)
    ) {
        errors.push("Invalid appointment status");
    }

    return errors;
};