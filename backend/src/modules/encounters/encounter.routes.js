import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import validationMiddleware from "../../middlewares/validation.middleware.js";
import { ROLES } from "../../constants/roles.js";
import {
    createEncounter,
    getEncounterById,
    getEncountersByPatient,
    updateEncounter,
    updateEncounterStatus,
} from "./encounter.controller.js";
import { validateCreateEncounter, validateUpdateStatus } from "./encounter.validation.js";

const router = Router();

router.use(authMiddleware);

router.post("/", roleMiddleware(ROLES.DOCTOR, ROLES.SYSTEM_ADMIN), validationMiddleware(validateCreateEncounter), createEncounter);
router.get("/patient/:patientId", roleMiddleware(ROLES.PATIENT, ROLES.DOCTOR, ROLES.SYSTEM_ADMIN), getEncountersByPatient);
router.get("/:id", roleMiddleware(ROLES.PATIENT, ROLES.DOCTOR, ROLES.SYSTEM_ADMIN), getEncounterById);
router.patch("/:id", roleMiddleware(ROLES.DOCTOR, ROLES.SYSTEM_ADMIN), updateEncounter);
router.patch("/:id/status", roleMiddleware(ROLES.DOCTOR, ROLES.SYSTEM_ADMIN), validationMiddleware(validateUpdateStatus), updateEncounterStatus);

export default router;
