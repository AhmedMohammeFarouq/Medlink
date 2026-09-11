import Patient from "./patient.model.js";
import { ROLES } from "../../constants/roles.js";

export const getOrCreatePatientProfile = async (userId) => {
    let patient = await Patient.findOne({ userId });

    if (!patient) {
        patient = await Patient.create({ userId });
    }

    return patient;
};

export const getPatientById = async (patientId) => {
    const patient = await Patient.findById(patientId);

    if (!patient) {
        const error = new Error("Patient not found");
        error.statusCode = 404;
        throw error;
    }

    return patient;
};

export const updatePatientProfile = async (patientId, updateData) => {
    const patient = await Patient.findByIdAndUpdate(patientId, updateData, {
        new: true,
        runValidators: true,
    });

    if (!patient) {
        const error = new Error("Patient not found");
        error.statusCode = 404;
        throw error;
    }

    return patient;
};

export const checkPatientAccess = (user, patient) => {
    const isOwner = String(patient.userId) === String(user.userId);
    const isStaff = user.role === ROLES.DOCTOR || user.role === ROLES.SYSTEM_ADMIN;

    if (!isOwner && !isStaff) {
        const error = new Error("Access denied");
        error.statusCode = 403;
        throw error;
    }
};
