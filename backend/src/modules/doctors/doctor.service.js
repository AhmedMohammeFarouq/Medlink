import Doctor from "./doctor.model.js";

const getAllDoctors = async () => {
    return await Doctor.find();
};

const createDoctor = async (doctorData) => {
    return await Doctor.create(doctorData);
};
const getDoctorById = async (doctorId) => {
    return await Doctor.findById(doctorId);
};
const updateDoctor = async (doctorId, updateData) => {
    return await Doctor.findByIdAndUpdate(
        doctorId,
        updateData,
        {
            new: true,
            runValidators: true,
        }
    );
};
const getMyDoctorProfile = async (userId) => {
    return await Doctor.findOne({ userId });
};
export default {
    getAllDoctors,
    createDoctor,
    getDoctorById,
    updateDoctor,
    getMyDoctorProfile,
};