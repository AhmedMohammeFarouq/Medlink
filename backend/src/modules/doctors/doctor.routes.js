import express from "express";

import doctorController from "./doctor.controller.js";

const router = express.Router();

router.get("/", doctorController.getAllDoctors);

router.post("/", doctorController.createDoctor);

export default router;