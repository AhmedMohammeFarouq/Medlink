export const createDoctorValidation = (body) => {
    const errors = [];

    if (!body.userId) {
        errors.push("User ID is required");
    }

    if (!body.professionalInfo) {
        errors.push("Professional information is required");
    } else {
        if (!body.professionalInfo.specialty) {
            errors.push("Specialty is required");
        }

        if (
            body.professionalInfo.yearsOfExperience !== undefined &&
            body.professionalInfo.yearsOfExperience < 0
        ) {
            errors.push("Years of experience cannot be negative");
        }
    }

    if (body.clinics !== undefined && !Array.isArray(body.clinics)) {
        errors.push("Clinics must be an array");
    }

    if (body.availability !== undefined &&
        typeof body.availability !== "object") {
        errors.push("Availability must be an object");
    }

    return errors;
};