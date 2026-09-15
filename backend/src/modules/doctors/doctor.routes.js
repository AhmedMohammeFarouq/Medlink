import express from "express";

import doctorController from "./doctor.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import validationMiddleware from "../../middlewares/validation.middleware.js";
import { createDoctorValidation } from "./doctor.validation.js";

const router = express.Router();

router.get("/", authMiddleware, doctorController.getAllDoctors);
router.get(
    "/me",
    authMiddleware,
    roleMiddleware("DOCTOR"),
    doctorController.getMyDoctorProfile
);

router.get(
    "/:id",
    authMiddleware,
    doctorController.getDoctorById
);
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("DOCTOR"),
    doctorController.updateDoctor
);

router.post(
    "/",
    authMiddleware,
    roleMiddleware("DOCTOR"),
    validationMiddleware(createDoctorValidation),
    doctorController.createDoctor
);
export default router;