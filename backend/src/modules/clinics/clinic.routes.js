import { Router } from "express";
import clinicController from "./clinic.controller.js";

const router = Router();

router.get("/", clinicController.getAllClinics);
router.get("/:id", clinicController.getClinicById);

export default router;
