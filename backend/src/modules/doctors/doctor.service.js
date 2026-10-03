import Doctor from "./doctor.model.js";

const getAllDoctors = async () => {
    return await Doctor.find().populate("userId", "firstName lastName email avatarUrl");
};

const getDoctorById = async (doctorId) => {
    return await Doctor.findById(doctorId).populate("userId", "firstName lastName email avatarUrl");
};

const getDoctorByUserId = async (userId) => {
    return await Doctor.findOne({ userId }).populate("userId", "firstName lastName email avatarUrl");
};

const createDoctor = async (doctorData) => {
    return await Doctor.create(doctorData);
};

export default {
    getAllDoctors,
    getDoctorById,
    getDoctorByUserId,
    createDoctor,
};