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
        const doctor = await doctorService.createDoctor(req.body);

        return res.status(201).json({
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
};