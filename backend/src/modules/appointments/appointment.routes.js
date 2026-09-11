import express from "express";
import appointmentController from "./appointment.controller.js";
import validationMiddleware from "../../middlewares/validation.middleware.js";
import { createAppointmentValidation, updateAppointmentValidation} from "./appointment.validation.js";

const router = express.Router();

router.get("/", appointmentController.getAllAppointments);
router.get("/:id", appointmentController.getAppointmentById);
router.put(
    "/:id",
    validationMiddleware(updateAppointmentValidation),
    appointmentController.updateAppointment
);
router.delete("/:id", appointmentController.deleteAppointment);
router.post("/", validationMiddleware(createAppointmentValidation), appointmentController.createAppointment);

export default router;