import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import validationMiddleware from "../../middlewares/validation.middleware.js";
import { ROLES } from "../../constants/roles.js";
import { getByPatientId, updateByPatientId, addAllergy } from "./medicalRecord.controller.js";
import { validateMedicalRecordUpdate, validateAllergy } from "./medicalRecord.validation.js";

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(ROLES.PATIENT, ROLES.DOCTOR, ROLES.SYSTEM_ADMIN));

router.get("/:patientId", getByPatientId);
router.patch("/:patientId", validationMiddleware(validateMedicalRecordUpdate), updateByPatientId);
router.post("/:patientId/allergies", validationMiddleware(validateAllergy), addAllergy);

export default router;
