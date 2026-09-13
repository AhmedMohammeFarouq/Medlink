import express from "express";

import doctorController from "./doctor.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";


const router = express.Router();

router.get("/", authMiddleware, doctorController.getAllDoctors);

router.post(
    "/",
    authMiddleware,
    roleMiddleware("DOCTOR"),
    doctorController.createDoctor
);
export default router;