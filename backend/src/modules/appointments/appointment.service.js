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
const confirmAppointment = async (appointmentId) => {
    if (!isValidObjectId(appointmentId)) {
        return null;
    }

    return await Appointment.findByIdAndUpdate(
        appointmentId,
        { status: "CONFIRMED" },
        { new: true, runValidators: true }
    );
};
const deleteAppointment = async (appointmentId) => {
    if (!isValidObjectId(appointmentId)) {
        return null;
    }

    return await Appointment.findByIdAndDelete(appointmentId);
};
const cancelAppointment = async (appointmentId, reason) => {
    if (!isValidObjectId(appointmentId)) {
        return null;
    }

    return await Appointment.findByIdAndUpdate(
        appointmentId,
        {
            status: "CANCELLED",
            cancellation: {
                reason,
                cancelledAt: new Date(),
            },
        },
        { new: true, runValidators: true }
    );
};
const rescheduleAppointment = async (appointmentId, updateData) => {
    if (!isValidObjectId(appointmentId)) {
        return null;
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
        return null;
    }

    return await Appointment.findByIdAndUpdate(
        appointmentId,
        {
            scheduledAt: updateData.scheduledAt,
            status: "RESCHEDULED",
            rescheduledFrom: appointment._id,
        },
        { new: true, runValidators: true }
    );
};
export default {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    confirmAppointment,
    deleteAppointment,
    cancelAppointment,
    rescheduleAppointment,
};