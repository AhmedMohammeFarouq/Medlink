import appointmentService from "./appointment.service.js";

const getAllAppointments = async (req, res, next) => {
    try {
        const appointments =
            await appointmentService.getAllAppointments();

        return res.status(200).json({
            success: true,
            data: appointments,
        });
    } catch (error) {
        next(error);
    }
};
const getAppointmentById = async (req, res, next) => {
    try {
        const appointment =
            await appointmentService.getAppointmentById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: appointment,
        });
    } catch (error) {
        next(error);
    }
};

const createAppointment = async (req, res, next) => {
    try {
        const appointment =
            await appointmentService.createAppointment(req.body);

        return res.status(201).json({
            success: true,
            data: appointment,
        });
    } catch (error) {
        next(error);
    }
};
const updateAppointment = async (req, res, next) => {
    try {
        const appointment =
            await appointmentService.updateAppointment(
                req.params.id,
                req.body
            );

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: appointment,
        });
    } catch (error) {
        next(error);
    }
};

const confirmAppointment = async (req, res, next) => {
    try {
        const appointment =
            await appointmentService.confirmAppointment(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: appointment,
        });
    } catch (error) {
        next(error);
    }
};
const cancelAppointment = async (req, res, next) => {
    try {
        const appointment =
            await appointmentService.cancelAppointment(
                req.params.id,
                req.body.reason
            );

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: appointment,
        });
    } catch (error) {
        next(error);
    }
};
const rescheduleAppointment = async (req, res, next) => {
    try {
        const appointment =
            await appointmentService.rescheduleAppointment(
                req.params.id,
                req.body
            );

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: appointment,
        });
    } catch (error) {
        next(error);
    }
};
const deleteAppointment = async (req, res, next) => {
    try {
        const appointment =
            await appointmentService.deleteAppointment(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: appointment,
        });
    } catch (error) {
        next(error);
    }
};
export default {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    confirmAppointment,
    cancelAppointment,
    rescheduleAppointment,
    deleteAppointment,
};