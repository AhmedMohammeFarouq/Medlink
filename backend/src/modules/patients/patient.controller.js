import * as patientService from "./patient.service.js";
import * as medicalRecordService from "../medical-records/medicalRecord.service.js";
import * as encounterService from "../encounters/encounter.service.js";
import { successResponse } from "../../utils/apiResponse.js";

export const getMyProfile = async (req, res, next) => {
    try {
        const patient = await patientService.getOrCreatePatientProfile(req.user.userId);

        return successResponse({ res, message: "Profile retrieved", data: patient });
    } catch (error) {
        next(error);
    }
};

export const updateMyProfile = async (req, res, next) => {
    try {
        const patient = await patientService.getOrCreatePatientProfile(req.user.userId);
        const updated = await patientService.updatePatientProfile(patient._id, req.body);

        return successResponse({ res, message: "Profile updated", data: updated });
    } catch (error) {
        next(error);
    }
};

export const getPatientById = async (req, res, next) => {
    try {
        const patient = await patientService.getPatientById(req.params.id);
        patientService.checkPatientAccess(req.user, patient);

        return successResponse({ res, message: "Patient retrieved", data: patient });
    } catch (error) {
        next(error);
    }
};

export const getPatientMedicalRecord = async (req, res, next) => {
    try {
        const patient = await patientService.getPatientById(req.params.id);
        patientService.checkPatientAccess(req.user, patient);

        const record = await medicalRecordService.getOrCreateMedicalRecord(patient._id);

        return successResponse({ res, message: "Medical record retrieved", data: record });
    } catch (error) {
        next(error);
    }
};

export const getPatientTimeline = async (req, res, next) => {
    try {
        const patient = await patientService.getPatientById(req.params.id);
        patientService.checkPatientAccess(req.user, patient);

        const timeline = await encounterService.getPatientTimeline(patient._id);

        return successResponse({ res, message: "Timeline retrieved", data: timeline });
    } catch (error) {
        next(error);
    }
};
