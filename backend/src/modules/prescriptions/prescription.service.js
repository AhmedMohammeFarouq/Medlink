import Prescription from "./prescription.model.js";

const getAllPrescriptions = async () => {
    return await Prescription.find();
};

const getPrescriptionById = async (prescriptionId) => {
    return await Prescription.findById(prescriptionId);
};

const createPrescription = async (prescriptionData) => {
    return await Prescription.create(prescriptionData);
};

const updatePrescription = async (prescriptionId, updateData) => {
    return await Prescription.findByIdAndUpdate(
        prescriptionId,
        updateData,
        { new: true, runValidators: true }
    );
};

const deletePrescription = async (prescriptionId) => {
    return await Prescription.findByIdAndDelete(prescriptionId);
};

export default {
    getAllPrescriptions,
    getPrescriptionById,
    createPrescription,
    updatePrescription,
    deletePrescription,
};