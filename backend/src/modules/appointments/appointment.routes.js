import express from "express";
import appointmentController from "./appointment.controller.js";
import validationMiddleware from "../../middlewares/validation.middleware.js";
import { createAppointmentValidation, updateAppointmentValidation} from "./appointment.validation.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
const router = express.Router();

router.get(
    "/",
    authMiddleware,
    appointmentController.getAllAppointments
);

router.get(
    "/:id",
    authMiddleware,
    appointmentController.getAppointmentById
);
router.put(
    "/:id",
    authMiddleware,
    validationMiddleware(updateAppointmentValidation),
    appointmentController.updateAppointment
);

router.delete(
    "/:id",
    authMiddleware,
    appointmentController.deleteAppointment
);
router.post(
    "/",
    authMiddleware,
    roleMiddleware("PATIENT"),
    validationMiddleware(createAppointmentValidation),
    appointmentController.createAppointment
);

export default router;