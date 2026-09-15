import express from "express";
import prescriptionController from "./prescription.controller.js";
import validationMiddleware from "../../middlewares/validation.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

import { createPrescriptionValidation  , updatePrescriptionValidation} from "./prescription.validation.js";
const router = express.Router();

router.get("/", authMiddleware, prescriptionController.getAllPrescriptions);
router.get(
    "/:id",
    authMiddleware,
    prescriptionController.getPrescriptionById
);

router.post(
    "/",
    authMiddleware,
    roleMiddleware("DOCTOR"),
    validationMiddleware(createPrescriptionValidation),
    prescriptionController.createPrescription
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("DOCTOR"),
    validationMiddleware(updatePrescriptionValidation),
    prescriptionController.updatePrescription
);
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("DOCTOR"),
    prescriptionController.deletePrescription
);
export default router;