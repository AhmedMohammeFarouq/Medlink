import Prescription from "./prescription.model.js";

const populatePrescription = (query) => {
    return query
        .populate({
            path: "patientId",
            populate: {
                path: "userId",
                select: "firstName lastName",
            },
        })
        .populate({
            path: "doctorId",
            populate: {
                path: "userId",
                select: "firstName lastName",
            },
        });
};

const getAllPrescriptions = async () => {
    return await populatePrescription(
        Prescription.find()
    );
};

const getPrescriptionById = async (prescriptionId) => {
    return await populatePrescription(
        Prescription.findById(prescriptionId)
    );
};

const createPrescription = async (prescriptionData) => {
    return await Prescription.create(prescriptionData);
};

const updatePrescription = async (prescriptionId, updateData) => {
    return await Prescription.findByIdAndUpdate(
        prescriptionId,
        updateData,
        {
            new: true,
            runValidators: true,
        }
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