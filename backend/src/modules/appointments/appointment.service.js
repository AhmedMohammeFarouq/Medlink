import Appointment from "./appointment.model.js";

const getAllAppointments = async () => {
    return await Appointment.find();
};
const getAppointmentById = async (appointmentId) => {
    return await Appointment.findById(appointmentId);
};
const createAppointment = async (appointmentData) => {
    return await Appointment.create(appointmentData);
};
const updateAppointment = async (appointmentId, updateData) => {
    return await Appointment.findByIdAndUpdate(
        appointmentId,
        updateData,
        { new: true, runValidators: true }
    );
};
const deleteAppointment = async (appointmentId) => {
    return await Appointment.findByIdAndDelete(appointmentId);
};
export default {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment,
};