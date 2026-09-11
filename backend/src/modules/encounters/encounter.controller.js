import * as encounterService from "./encounter.service.js";
import * as patientService from "../patients/patient.service.js";
import { successResponse } from "../../utils/apiResponse.js";

export const createEncounter = async (req, res, next) => {
    try {
        const patient = await patientService.getPatientById(req.body.patientId);
        patientService.checkPatientAccess(req.user, patient);

        const encounter = await encounterService.createEncounter(req.body, req.user.userId);

        return successResponse({ res, statusCode: 201, message: "Encounter created", data: encounter });
    } catch (error) {
        next(error);
    }
};

export const getEncounterById = async (req, res, next) => {
    try {
        const encounter = await encounterService.getEncounterById(req.params.id);

        const patient = await patientService.getPatientById(encounter.patientId);
        patientService.checkPatientAccess(req.user, patient);

        return successResponse({ res, message: "Encounter retrieved", data: encounter });
    } catch (error) {
        next(error);
    }
};

export const getEncountersByPatient = async (req, res, next) => {
    try {
        const patient = await patientService.getPatientById(req.params.patientId);
        patientService.checkPatientAccess(req.user, patient);

        const encounters = await encounterService.getEncountersByPatient(patient._id);

        return successResponse({ res, message: "Encounters retrieved", data: encounters });
    } catch (error) {
        next(error);
    }
};

export const updateEncounter = async (req, res, next) => {
    try {
        const encounter = await encounterService.getEncounterById(req.params.id);

        const patient = await patientService.getPatientById(encounter.patientId);
        patientService.checkPatientAccess(req.user, patient);

        const updated = await encounterService.updateEncounter(req.params.id, req.body);

        return successResponse({ res, message: "Encounter updated", data: updated });
    } catch (error) {
        next(error);
    }
};

export const updateEncounterStatus = async (req, res, next) => {
    try {
        const encounter = await encounterService.getEncounterById(req.params.id);

        const patient = await patientService.getPatientById(encounter.patientId);
        patientService.checkPatientAccess(req.user, patient);

        const updated = await encounterService.updateEncounterStatus(req.params.id, req.body.status);

        return successResponse({ res, message: "Encounter status updated", data: updated });
    } catch (error) {
        next(error);
    }
};
