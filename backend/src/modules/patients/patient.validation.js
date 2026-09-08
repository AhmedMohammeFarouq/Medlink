const GENDERS = ["MALE", "FEMALE", "OTHER"];
const BLOOD_TYPES = [
    "A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE",
    "AB_POSITIVE", "AB_NEGATIVE", "O_POSITIVE", "O_NEGATIVE", "UNKNOWN",
];

export const validatePatientUpdate = (body = {}) => {
    const errors = [];

    if (body.gender && !GENDERS.includes(body.gender)) {
        errors.push("gender is invalid");
    }

    if (body.bloodType && !BLOOD_TYPES.includes(body.bloodType)) {
        errors.push("bloodType is invalid");
    }

    if (body.height !== undefined && (typeof body.height !== "number" || body.height < 0)) {
        errors.push("height must be a positive number");
    }

    if (body.weight !== undefined && (typeof body.weight !== "number" || body.weight < 0)) {
        errors.push("weight must be a positive number");
    }

    return errors;
};
