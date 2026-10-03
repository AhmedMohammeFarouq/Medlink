import Appointment from "./appointment.model.js";

const getAllAppointments = async () => {
    return await Appointment.find();
};
const getAppointmentsByFilter = async (filter = {}) => {
    return await Appointment.find(filter).sort({ scheduledAt: -1 });
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
    getAppointmentsByFilter,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment,
};