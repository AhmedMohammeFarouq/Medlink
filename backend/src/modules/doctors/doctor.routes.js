import express from "express";
import doctorController from "./doctor.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/profile", authMiddleware, doctorController.getDoctorProfile);
router.get("/", doctorController.getAllDoctors);
router.get("/:id", doctorController.getDoctorById);
router.post("/", authMiddleware, doctorController.createDoctor);

export default router;