import express from "express";

import doctorController from "./doctor.controller.js";

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
router.get("/", doctorController.getAllDoctors);

router.post("/", doctorController.createDoctor);

export default router;