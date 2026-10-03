import appointmentService from "./appointment.service.js";
import * as patientService from "../patients/patient.service.js";
import Doctor from "../doctors/doctor.model.js";
import Clinic from "../clinics/clinic.model.js";

const getMyAppointments = async (req, res, next) => {
    try {
        let filter = {};
        if (req.user) {
            if (req.user.role === "PATIENT") {
                const patient = await patientService.getOrCreatePatientProfile(req.user.userId);
                filter = { patientId: patient ? patient._id : req.user.userId };
            } else if (req.user.role === "DOCTOR") {
                const doctor = await Doctor.findOne({ userId: req.user.userId });
                filter = { doctorId: doctor ? doctor._id : req.user.userId };
            }
        }
        const appointments = await appointmentService.getAppointmentsByFilter(filter);
        return res.status(200).json({
            success: true,
            data: appointments,
        });
    } catch (error) {
        next(error);
    }
};

const cancelAppointment = async (req, res, next) => {
    try {
        const appointment = await appointmentService.updateAppointment(
            req.params.id,
            {
                status: "CANCELLED",
                "cancellation.cancelledBy": req.user?.userId || null,
                "cancellation.cancelledAt": new Date(),
                "cancellation.reason": req.body?.reason || null
            }
        );
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }
        return res.status(200).json({ success: true, data: appointment });
    } catch (error) {
        next(error);
    }
};

const confirmAppointment = async (req, res, next) => {
    try {
        const appointment = await appointmentService.updateAppointment(
            req.params.id,
            { status: "CONFIRMED" }
        );
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }
        return res.status(200).json({ success: true, data: appointment });
    } catch (error) {
        next(error);
    }
};

const completeAppointment = async (req, res, next) => {
    try {
        const appointment = await appointmentService.updateAppointment(
            req.params.id,
            { status: "COMPLETED" }
        );
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }
        return res.status(200).json({ success: true, data: appointment });
    } catch (error) {
        next(error);
    }
};

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
        const appointmentData = { ...req.body };

        // 1. Resolve patientId automatically if not provided or if patient is logged in
        if (req.user) {
            const patient = await patientService.getOrCreatePatientProfile(req.user.userId);
            appointmentData.patientId = patient ? patient._id : req.user.userId;
        }

        // 2. Resolve doctorId: handle case if doctorId is Doctor._id or Doctor.userId
        if (appointmentData.doctorId) {
            const doctor = await Doctor.findOne({
                $or: [{ _id: appointmentData.doctorId }, { userId: appointmentData.doctorId }]
            });
            if (doctor) {
                appointmentData.doctorId = doctor._id;
                // If clinicId is not provided, try to find clinic from doctor or default clinic
                if (!appointmentData.clinicId) {
                    if (doctor.clinics && doctor.clinics.length > 0 && doctor.clinics[0].clinicId) {
                        appointmentData.clinicId = doctor.clinics[0].clinicId;
                    } else {
                        const clinic = await Clinic.findOne({
                            $or: [{ doctors: doctor._id }, { status: "ACTIVE" }]
                        });
                        if (clinic) {
                            appointmentData.clinicId = clinic._id;
                        }
                    }
                }
            }
        }

        // If clinicId is still not set, fallback to any active clinic if available
        if (!appointmentData.clinicId) {
            const defaultClinic = await Clinic.findOne({ status: "ACTIVE" });
            if (defaultClinic) {
                appointmentData.clinicId = defaultClinic._id;
            }
        }

        const appointment =
            await appointmentService.createAppointment(appointmentData);

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
    getMyAppointments,
    cancelAppointment,
    confirmAppointment,
    completeAppointment,
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment,
};