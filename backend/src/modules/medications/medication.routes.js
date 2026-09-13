import { Router } from "express";

import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import { ROLES } from "../../constants/roles.js";

import { MedicationController } from "./medication.controller.js";

import {
  createMedicationValidation,
  medicationIdValidation,
} from "./medication.validation.js";

const router = Router();

router.use(authMiddleware);

router.post(
  "/",
  roleMiddleware(ROLES.DOCTOR, ROLES.SYSTEM_ADMIN, ROLES.CLINIC_ADMIN),
  createMedicationValidation,
  MedicationController.create
);

router.get(
  "/",
  roleMiddleware(ROLES.DOCTOR, ROLES.SYSTEM_ADMIN, ROLES.CLINIC_ADMIN),
  MedicationController.getAll
);

router.get(
  "/:id",
  medicationIdValidation,
  MedicationController.getById
);

router.patch(
  "/:id/status",
  roleMiddleware(ROLES.DOCTOR, ROLES.SYSTEM_ADMIN, ROLES.CLINIC_ADMIN),
  medicationIdValidation,
  MedicationController.updateStatus
);

router.delete(
  "/:id",
  roleMiddleware(ROLES.DOCTOR, ROLES.SYSTEM_ADMIN, ROLES.CLINIC_ADMIN),
  medicationIdValidation,
  MedicationController.deleteMedication
);

export default router;