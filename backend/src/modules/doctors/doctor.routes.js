import express from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
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
    doctorController.createDoctor
);

export default router;