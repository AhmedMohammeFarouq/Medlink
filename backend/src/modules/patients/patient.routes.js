import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import validationMiddleware from "../../middlewares/validation.middleware.js";
import { ROLES } from "../../constants/roles.js";
import {
    getMyProfile,
    updateMyProfile,
    getPatientById,
    getPatientMedicalRecord,
    getPatientTimeline,
} from "./patient.controller.js";
import { validatePatientUpdate } from "./patient.validation.js";

const router = Router();

router.use(authMiddleware);

router.get("/me", getMyProfile);
router.patch("/me", validationMiddleware(validatePatientUpdate), updateMyProfile);

router.get("/:id", roleMiddleware(ROLES.PATIENT, ROLES.DOCTOR, ROLES.SYSTEM_ADMIN), getPatientById);
router.get(
    "/:id/medical-record",
    roleMiddleware(ROLES.PATIENT, ROLES.DOCTOR, ROLES.SYSTEM_ADMIN),
    getPatientMedicalRecord
);
router.get(
    "/:id/timeline",
    roleMiddleware(ROLES.PATIENT, ROLES.DOCTOR, ROLES.SYSTEM_ADMIN),
    getPatientTimeline
);

export default router;
