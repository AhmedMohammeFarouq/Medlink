import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import { ROLES } from "../../constants/roles.js";

import { ConsentController } from "./consent.controller.js";
import {
  createConsentValidation,
  consentIdValidation,
} from "./consent.validation.js";

const router = Router();

router.use(authMiddleware);

router.post(
  "/",
  roleMiddleware(ROLES.PATIENT, ROLES.DOCTOR, ROLES.SYSTEM_ADMIN),
  createConsentValidation,
  ConsentController.create,
);

router.get(
  "/check-access",
  roleMiddleware(ROLES.DOCTOR, ROLES.SYSTEM_ADMIN, ROLES.CLINIC_ADMIN),
  ConsentController.checkAccess,
);

router.get(
  "/patient/:patientId",
  roleMiddleware(
    ROLES.PATIENT,
    ROLES.DOCTOR,
    ROLES.SYSTEM_ADMIN,
    ROLES.CLINIC_ADMIN,
  ),
  ConsentController.getPatientConsents,
);

router.get(
  "/:id",
  roleMiddleware(ROLES.PATIENT, ROLES.DOCTOR, ROLES.SYSTEM_ADMIN),
  consentIdValidation,
  ConsentController.getById,
);

router.patch(
  "/:id/revoke",
  roleMiddleware(ROLES.PATIENT, ROLES.DOCTOR, ROLES.SYSTEM_ADMIN),
  consentIdValidation,
  ConsentController.revoke,
);

export default router;
