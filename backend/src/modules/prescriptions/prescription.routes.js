import express from "express";
import prescriptionController from "./prescription.controller.js";
import validationMiddleware from "../../middlewares/validation.middleware.js";
import { createPrescriptionValidation  , updatePrescriptionValidation} from "./prescription.validation.js";
const router = express.Router();

router.get("/", prescriptionController.getAllPrescriptions);

router.get("/:id", prescriptionController.getPrescriptionById);

router.post("/", validationMiddleware(createPrescriptionValidation), prescriptionController.createPrescription);

router.put(
    "/:id",
    validationMiddleware(updatePrescriptionValidation),
    prescriptionController.updatePrescription
);
router.delete("/:id", prescriptionController.deletePrescription);

export default router;