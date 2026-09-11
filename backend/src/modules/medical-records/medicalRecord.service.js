import MedicalRecord from "./medicalRecord.model.js";

export const getOrCreateMedicalRecord = async (patientId) => {
    let record = await MedicalRecord.findOne({ patientId });

    if (!record) {
        record = await MedicalRecord.create({ patientId });
    }

    return record;
};

export const updateMedicalRecord = async (patientId, updateData, updatedBy) => {
    const record = await MedicalRecord.findOneAndUpdate(
        { patientId },
        { ...updateData, lastUpdatedBy: updatedBy },
        { new: true, upsert: true, runValidators: true }
    );

    return record;
};

export const addAllergy = async (patientId, allergy) => {
    const record = await MedicalRecord.findOneAndUpdate(
        { patientId },
        { $push: { allergies: allergy } },
        { new: true, upsert: true }
    );

    return record;
};
