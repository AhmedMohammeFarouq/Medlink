import Clinic from "./clinic.model.js";

export const getAllClinics = async (filter = {}) => {
    return await Clinic.find(filter).populate("doctors");
};

export const getClinicById = async (id) => {
    return await Clinic.findById(id).populate("doctors");
};

export default {
    getAllClinics,
    getClinicById,
};
