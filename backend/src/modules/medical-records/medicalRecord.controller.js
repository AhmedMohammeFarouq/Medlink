import * as medicalRecordService from "./medicalRecord.service.js";
import * as patientService from "../patients/patient.service.js";
import { successResponse } from "../../utils/apiResponse.js";

export const getByPatientId = async (req, res, next) => {
    try {
        const patient = await patientService.getPatientById(req.params.patientId);
        patientService.checkPatientAccess(req.user, patient);

        const record = await medicalRecordService.getOrCreateMedicalRecord(patient._id);

        return successResponse({ res, message: "Medical record retrieved", data: record });
    } catch (error) {
        next(error);
    }
};

export const updateByPatientId = async (req, res, next) => {
    try {
        const patient = await patientService.getPatientById(req.params.patientId);
        patientService.checkPatientAccess(req.user, patient);

        const record = await medicalRecordService.updateMedicalRecord(patient._id, req.body, req.user.userId);

        return successResponse({ res, message: "Medical record updated", data: record });
    } catch (error) {
        next(error);
    }
};

export const addAllergy = async (req, res, next) => {
    try {
        const patient = await patientService.getPatientById(req.params.patientId);
        patientService.checkPatientAccess(req.user, patient);

        const record = await medicalRecordService.addAllergy(patient._id, req.body);

        return successResponse({ res, statusCode: 201, message: "Allergy added", data: record });
    } catch (error) {
        next(error);
    }
};
