import clinicService from "./clinic.service.js";

export const getAllClinics = async (req, res, next) => {
    try {
        const clinics = await clinicService.getAllClinics();
        return res.status(200).json({
            success: true,
            data: clinics,
        });
    } catch (error) {
        next(error);
    }
};

export const getClinicById = async (req, res, next) => {
    try {
        const clinic = await clinicService.getClinicById(req.params.id);
        if (!clinic) {
            return res.status(404).json({
                success: false,
                message: "Clinic not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: clinic,
        });
    } catch (error) {
        next(error);
    }
};

export default {
    getAllClinics,
    getClinicById,
};
