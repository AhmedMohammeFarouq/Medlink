import Doctor from "./doctor.model.js";

const getAllDoctors = async () => {
    return await Doctor.find();
};

const createDoctor = async (doctorData) => {
    return await Doctor.create(doctorData);
};

export default {
    getAllDoctors,
    createDoctor,
};