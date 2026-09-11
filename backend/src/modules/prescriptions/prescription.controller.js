import prescriptionService from "./prescription.service.js";

const getAllPrescriptions = async (req, res, next) => {
    try {
        const prescriptions =
            await prescriptionService.getAllPrescriptions();

        return res.status(200).json({
            success: true,
            data: prescriptions,
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
            data: prescription,
        });
    } catch (error) {
        next(error);
    }
};

const createPrescription = async (req, res, next) => {
    try {
        const prescription =
            await prescriptionService.createPrescription(req.body);

        return res.status(201).json({
            success: true,
            data: prescription,
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