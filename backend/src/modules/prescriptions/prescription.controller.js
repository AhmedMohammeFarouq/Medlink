import prescriptionService from "./prescription.service.js";
import Patient from "../patients/patient.model.js";
import Doctor from "../doctors/doctor.model.js";
const formatPrescription = (prescription) => {
    const data = prescription.toObject();

    return {
        ...data,

        prescriptionCode:
            data.prescriptionNumber || `RX-${data._id}`,

        issueDate: data.issuedAt,

        patientName: data.patientId?.userId
            ? `${data.patientId.userId.firstName} ${data.patientId.userId.lastName}`
            : undefined,
            patientHealthId: data.patientId?.healthId,
        doctorName: data.doctorId?.userId
            ? `${data.doctorId.userId.firstName} ${data.doctorId.userId.lastName}`
            : undefined,
    };
};
const getAllPrescriptions = async (req, res, next) => {
    try {
        const prescriptions =
            await prescriptionService.getAllPrescriptions();

        const formattedPrescriptions =
            prescriptions.map(formatPrescription);

        return res.status(200).json({
            success: true,
            data: formattedPrescriptions,
        });
    } catch (error) {
        next(error);
    }
};
const getPrescriptionById = async (req, res, next) => {
    try {
        const prescription =
            await prescriptionService.getPrescriptionById(
                req.params.id
            );

        if (!prescription) {
            return res.status(404).json({
                success: false,
                message: "Prescription not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: formatPrescription(prescription),
        });
    } catch (error) {
        next(error);
    }
};
const createPrescription = async (req, res, next) => {
    try {
        const { patientId: healthId, ...prescriptionData } = req.body;

        // Find patient using Health ID
        const patient = await Patient.findOne({ healthId });

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found",
            });
        }

        // Find doctor linked to the logged-in user
        const doctor = await Doctor.findOne({
            userId: req.user.userId,
        });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor profile not found",
            });
        }

        const prescription =
            await prescriptionService.createPrescription({
                ...prescriptionData,
                patientId: patient._id,
                doctorId: doctor._id,
                createdBy: req.user.userId,
            });

        return res.status(201).json({
            success: true,
            data: formatPrescription(prescription),
        });
    } catch (error) {
        next(error);
    }
};
const updatePrescription = async (req, res, next) => {
    try {
        const prescription =
            await prescriptionService.updatePrescription(
                req.params.id,
                req.body
            );

        if (!prescription) {
            return res.status(404).json({
                success: false,
                message: "Prescription not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: prescription,
        });
    } catch (error) {
        next(error);
    }
};

const deletePrescription = async (req, res, next) => {
    try {
        const prescription =
            await prescriptionService.deletePrescription(
                req.params.id
            );

        if (!prescription) {
            return res.status(404).json({
                success: false,
                message: "Prescription not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: prescription,
        });
    } catch (error) {
        next(error);
    }
};

export default {
    getAllPrescriptions,
    getPrescriptionById,
    createPrescription,
    updatePrescription,
    deletePrescription,
};