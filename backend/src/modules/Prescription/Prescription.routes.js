import { Router } from "express";

import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import { ROLES } from "../../constants/roles.js";

import { PrescriptionController } from "./Prescription.controller.js";

import {
  createPrescriptionValidation,
  prescriptionIdValidation,
} from "./Prescription.validation.js";

const router = Router();

router.use(authMiddleware);

router.post(
  "/",
  roleMiddleware(ROLES.DOCTOR, ROLES.SYSTEM_ADMIN, ROLES.CLINIC_ADMIN),
  createPrescriptionValidation,
  PrescriptionController.create
);

router.get(
  "/",
  roleMiddleware(ROLES.DOCTOR, ROLES.SYSTEM_ADMIN, ROLES.CLINIC_ADMIN),
  PrescriptionController.getAll
);

router.get(
  "/lookup-patient",
  roleMiddleware(ROLES.DOCTOR, ROLES.SYSTEM_ADMIN, ROLES.CLINIC_ADMIN),
  PrescriptionController.lookupPatient
);

router.get(
  "/:id",
  prescriptionIdValidation,
  PrescriptionController.getById
);

router.put(
  "/:id",
  roleMiddleware(ROLES.DOCTOR, ROLES.SYSTEM_ADMIN, ROLES.CLINIC_ADMIN),
  prescriptionIdValidation,
  PrescriptionController.update
);

router.patch(
  "/:id/status",
  roleMiddleware(ROLES.DOCTOR, ROLES.SYSTEM_ADMIN, ROLES.CLINIC_ADMIN),
  prescriptionIdValidation,
  PrescriptionController.updateStatus
);

router.delete(
  "/:id",
  roleMiddleware(ROLES.DOCTOR, ROLES.SYSTEM_ADMIN, ROLES.CLINIC_ADMIN),
  prescriptionIdValidation,
  PrescriptionController.deletePrescription
);

export default router;