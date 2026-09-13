import Appointment from "./appointment.model.js";
const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
};
const getAllAppointments = async () => {
    return await Appointment.find();
};
const getAppointmentById = async (appointmentId) => {
    if (!isValidObjectId(appointmentId)) {
        return null;
    }

    return await Appointment.findById(appointmentId);
};
const createAppointment = async (appointmentData) => {
    return await Appointment.create(appointmentData);
};
const updateAppointment = async (appointmentId, updateData) => {
    if (!isValidObjectId(appointmentId)) {
        return null;
    }

    return await Appointment.findByIdAndUpdate(
        appointmentId,
        updateData,
        { new: true, runValidators: true }
    );
};
const deleteAppointment = async (appointmentId) => {
    if (!isValidObjectId(appointmentId)) {
        return null;
    }

    return await Appointment.findByIdAndDelete(appointmentId);
};
export default {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment,
};