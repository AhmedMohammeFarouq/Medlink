import * as medicalRecordService from "./medicalRecord.service.js";
import * as patientService from "../patients/patient.service.js";
import { successResponse } from "../../utils/apiResponse.js";
import { ROLES } from "../../constants/roles.js";

const formatMedicalRecord = (record) => {
    if (!record) return null;
    const doc = record.toObject ? record.toObject() : { ...record };

    const title = doc.title || "Electronic Health Record (EHR Summary)";
    const category = doc.category || "CLINICAL_NOTE";
    const recordDate = doc.recordDate || doc.updatedAt || doc.createdAt || new Date();

    let diagnosis = doc.diagnosis;
    if (!diagnosis && doc.chronicConditions && doc.chronicConditions.length > 0) {
        diagnosis = doc.chronicConditions.map(c => c.name).join(", ");
    }

    let summaryParts = [];
    if (doc.notes) summaryParts.push(doc.notes);
    if (doc.bloodType && doc.bloodType !== "UNKNOWN") summaryParts.push(`Blood Type: ${doc.bloodType}`);
    if (doc.allergies && doc.allergies.length > 0) {
        summaryParts.push(`Allergies: ${doc.allergies.map(a => a.name).join(", ")}`);
    }
    if (doc.chronicConditions && doc.chronicConditions.length > 0) {
        summaryParts.push(`Conditions: ${doc.chronicConditions.map(c => c.name).join(", ")}`);
    }
    const summary = doc.summary || (summaryParts.length > 0 ? summaryParts.join(" • ") : "Verified electronic health profile on file.");

    return {
        ...doc,
        title,
        category,
        recordDate,
        diagnosis,
        summary
    };
};

export const getMedicalRecords = async (req, res, next) => {
    try {
        if (req.query.patientId) {
            const patient = await patientService.getPatientById(req.query.patientId);
            patientService.checkPatientAccess(req.user, patient);
            const record = await medicalRecordService.getOrCreateMedicalRecord(patient._id);
            return successResponse({ res, message: "Medical record retrieved", data: record ? [formatMedicalRecord(record)] : [] });
        }

        if (req.user.role === ROLES.PATIENT) {
            const patient = await patientService.getOrCreatePatientProfile(req.user.userId);
            const record = await medicalRecordService.getOrCreateMedicalRecord(patient._id);
            const hasData = record && (
                (record.bloodType && record.bloodType !== "UNKNOWN") ||
                (record.allergies && record.allergies.length > 0) ||
                (record.chronicConditions && record.chronicConditions.length > 0) ||
                (record.familyHistory && record.familyHistory.length > 0) ||
                (record.surgicalHistory && record.surgicalHistory.length > 0) ||
                record.notes
            );
            return successResponse({ 
                res, 
                message: "Medical record retrieved", 
                data: hasData ? [formatMedicalRecord(record)] : [] 
            });
        }

        const records = await medicalRecordService.getAllMedicalRecords();
        return successResponse({ res, message: "Medical records retrieved", data: records.map(formatMedicalRecord) });
    } catch (error) {
        next(error);
    }
};

export const getByPatientId = async (req, res, next) => {
    try {
        const patient = await patientService.getPatientById(req.params.patientId);
        patientService.checkPatientAccess(req.user, patient);

        const record = await medicalRecordService.getOrCreateMedicalRecord(patient._id);

        return successResponse({ res, message: "Medical record retrieved", data: formatMedicalRecord(record) });
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
