import express from "express";
import appointmentController from "./appointment.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import validationMiddleware from "../../middlewares/validation.middleware.js";
import { createAppointmentValidation, updateAppointmentValidation} from "./appointment.validation.js";

const router = express.Router();

router.get("/my", authMiddleware, appointmentController.getMyAppointments);
router.patch("/:id/cancel", authMiddleware, appointmentController.cancelAppointment);
router.patch("/:id/confirm", authMiddleware, appointmentController.confirmAppointment);
router.patch("/:id/complete", authMiddleware, appointmentController.completeAppointment);

router.get("/", appointmentController.getAllAppointments);
router.get("/:id", appointmentController.getAppointmentById);
router.put(
    "/:id",
    validationMiddleware(updateAppointmentValidation),
    appointmentController.updateAppointment
);
router.delete("/:id", appointmentController.deleteAppointment);
router.post("/", authMiddleware, validationMiddleware(createAppointmentValidation), appointmentController.createAppointment);

export default router;