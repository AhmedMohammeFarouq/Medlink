import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import { ROLES } from "../../constants/roles.js";

import { ConsentController } from "./consent.controller.js";
import { ConsentService } from "./consent.service.js";
import {
  createConsentValidation,
  createConsentRequestValidation,
  consentIdValidation,
} from "./consent.validation.js";

const router = Router();

router.use(authMiddleware);

const requireConsentParty = async (req, res, next) => {
  try {
    const consent = await ConsentService.getConsentById(req.params.id);
    if (!consent) {
      return res.status(404).json({ success: false, message: "Consent not found" });
    }

    const userId = req.user?.userId?.toString();
    const isOwner = consent.patientId.toString() === userId;
    const isGrantee = consent.grantedTo.toString() === userId;
    const isAdmin = req.user?.role === ROLES.SYSTEM_ADMIN;

    if (!isOwner && !isGrantee && !isAdmin) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    req.consent = consent;
    next();
  } catch (err) {
    next(err);
  }
};

const requireOwnPatientIdOrStaff = (req, res, next) => {
  if (req.user?.role === ROLES.PATIENT && req.user?.userId?.toString() !== req.params.patientId) {
    return res.status(403).json({ success: false, message: "Access denied" });
  }
  next();
};

router.post(
  "/",
  roleMiddleware(ROLES.PATIENT, ROLES.DOCTOR, ROLES.SYSTEM_ADMIN),
  createConsentValidation,
  ConsentController.create,
);

// جديد: الدكتور بس هو اللي يطلب consent
router.post(
  "/request",
  roleMiddleware(ROLES.DOCTOR),
  createConsentRequestValidation,
  ConsentController.requestConsent,
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
  requireOwnPatientIdOrStaff,
  ConsentController.getPatientConsents,
);

router.get(
  "/:id",
  roleMiddleware(ROLES.PATIENT, ROLES.DOCTOR, ROLES.SYSTEM_ADMIN),
  consentIdValidation,
  requireConsentParty,
  ConsentController.getById,
);

router.patch(
  "/:id/approve",
  roleMiddleware(ROLES.PATIENT),
  consentIdValidation,
  requireConsentParty,
  ConsentController.approve,
);

// جديد: المريض يرفض
router.patch(
  "/:id/reject",
  roleMiddleware(ROLES.PATIENT),
  consentIdValidation,
  requireConsentParty,
  ConsentController.reject,
);

router.patch(
  "/:id/revoke",
  roleMiddleware(ROLES.PATIENT, ROLES.DOCTOR, ROLES.SYSTEM_ADMIN),
  consentIdValidation,
  requireConsentParty,
  ConsentController.revoke,
);

export default router;