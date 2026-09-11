import { Router } from "express";

import authRouter from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/users/user.routes.js";
import consentRoutes from "../modules/consent/consent.routes.js";
import documentRoutes from "../modules/documents/document.routes.js";
import medicationRoutes from "../modules/medications/medication.routes.js";

import appointmentRoutes from "../modules/appointments/appointment.routes.js";
import doctorRoutes from "../modules/doctors/doctor.routes.js";
import prescriptionRoutes from "../modules/prescriptions/prescription.routes.js";

// import adminRoutes from "../modules/admin/admin.routes.js";
// import reviewRoutes from "../modules/reviews/review.routes.js";
// import auditRoutes from "../modules/audit/audit.routes.js";

const router = Router();

router.use("/v1/auth", authRouter);
router.use("/v1/users", userRoutes);

router.use("/v1/consent", consentRoutes);
router.use("/v1/document", documentRoutes);
router.use("/v1/medication", medicationRoutes);

router.use("/v1/prescriptions", prescriptionRoutes);
router.use("/v1/doctors", doctorRoutes);
router.use("/v1/appointments", appointmentRoutes);

// router.use("/v1/admin", adminRoutes);
// router.use("/v1/reviews", reviewRoutes);
// router.use("/v1/audit", auditRoutes);

export default router;