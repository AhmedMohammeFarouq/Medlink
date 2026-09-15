import doctorService from "./doctor.service.js";

const getAllDoctors = async (req, res, next) => {
    try {
        const doctors = await doctorService.getAllDoctors();

        return res.status(200).json({
            success: true,
            data: doctors,
        });
    } catch (error) {
        next(error);
    }
};

const createDoctor = async (req, res, next) => {
    try {
        const doctor = await doctorService.createDoctor({
    ...req.body,
    verification: {
        ...req.body.verification,
        status: "PENDING",
    },
});
        return res.status(201).json({
            success: true,
            data: doctor,
        });
    } catch (error) {
        next(error);
    }
};
const getDoctorById = async (req, res, next) => {
    try {
        const doctor = await doctorService.getDoctorById(req.params.id);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: doctor,
        });
    } catch (error) {
        next(error);
    }
};
const getMyDoctorProfile = async (req, res, next) => {
    try {
        const doctor = await doctorService.getMyDoctorProfile(
            req.user.userId
        );

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor profile not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: doctor,
        });
    } catch (error) {
        next(error);
    }
};
const updateDoctor = async (req, res, next) => {
    try {
        const doctor = await doctorService.updateDoctor(
            req.params.id,
            req.body
        );

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: doctor,
        });
    } catch (error) {
        next(error);
    }
};
export default {
    getAllDoctors,
    createDoctor,
    getDoctorById,
    updateDoctor,
    getMyDoctorProfile,
};