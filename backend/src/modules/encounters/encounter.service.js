import Encounter from "./encounter.model.js";
import * as medicalRecordService from "../medical-records/medicalRecord.service.js";

export const createEncounter = async (payload, createdBy) => {
    const medicalRecord = await medicalRecordService.getOrCreateMedicalRecord(payload.patientId);

    const encounter = await Encounter.create({
        ...payload,
        medicalRecordId: medicalRecord._id,
        createdBy,
    });

    return encounter;
};

export const getEncounterById = async (encounterId) => {
    const encounter = await Encounter.findById(encounterId);

    if (!encounter) {
        const error = new Error("Encounter not found");
        error.statusCode = 404;
        throw error;
    }

    return encounter;
};

export const getEncountersByPatient = async (patientId) => {
    return Encounter.find({ patientId }).sort({ createdAt: -1 });
};

export const updateEncounter = async (encounterId, updateData) => {
    const encounter = await Encounter.findByIdAndUpdate(encounterId, updateData, {
        new: true,
        runValidators: true,
    });

    if (!encounter) {
        const error = new Error("Encounter not found");
        error.statusCode = 404;
        throw error;
    }

    return encounter;
};

export const updateEncounterStatus = async (encounterId, status) => {
    const encounter = await getEncounterById(encounterId);

    if (encounter.status === "COMPLETED" || encounter.status === "CANCELLED") {
        const error = new Error(`Encounter is already ${encounter.status}, cannot change status`);
        error.statusCode = 409;
        throw error;
    }

    encounter.status = status;
    if (status === "IN_PROGRESS") encounter.startedAt = new Date();
    if (status === "COMPLETED") encounter.endedAt = new Date();

    await encounter.save();
    return encounter;
};

export const getPatientTimeline = async (patientId) => {
    return Encounter.find({ patientId })
        .sort({ createdAt: -1 })
        .select("type status startedAt endedAt chiefComplaint diagnosis createdAt");
};
