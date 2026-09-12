import { Router } from 'express';
import multer from 'multer';
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import { ROLES } from "../../constants/roles.js";
import { DocumentController } from './document.controller.js';
import { createDocumentValidation, documentIdValidation } from "./document.validation.js"
import { uploadMedicalDocument } from "../../middlewares/document-upload.middleware.js";
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }
});

const router = Router();
router.use(authMiddleware);
router.post(
    "/upload",
    roleMiddleware(ROLES.DOCTOR, ROLES.SYSTEM_ADMIN, ROLES.CLINIC_ADMIN, ROLES.PATIENT),
    uploadMedicalDocument,
    createDocumentValidation,
    DocumentController.createDocumentService
);
router.get(
    "/patient/:patientId",
    roleMiddleware(ROLES.DOCTOR, ROLES.SYSTEM_ADMIN, ROLES.CLINIC_ADMIN, ROLES.PATIENT, ROLES.RECEPTIONIST),
    DocumentController.getByPatient
);

router.get(
    "/:id",
    roleMiddleware(ROLES.DOCTOR, ROLES.SYSTEM_ADMIN, ROLES.CLINIC_ADMIN, ROLES.PATIENT),
    documentIdValidation,
    DocumentController.getById
);

router.delete(
    "/:id",
    roleMiddleware(ROLES.DOCTOR, ROLES.SYSTEM_ADMIN, ROLES.CLINIC_ADMIN),
    documentIdValidation,
    DocumentController.delete
);

export default router;