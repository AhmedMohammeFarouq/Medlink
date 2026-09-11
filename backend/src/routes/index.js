import { Router } from "express";
import authRouter from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/users/user.routes.js";
import consentRoutes from "../modules/consent/consent.routes.js";
import documentRoutes from "../modules/documents/document.routes.js";
import medicationRoutes from "../modules/medications/medication.routes.js";
const router = Router();

router.use("/v1/auth", authRouter);
router.use("/v1/users", userRoutes);
router.use("/v1/consent", consentRoutes);
router.use("/v1/document", documentRoutes);
router.use("/v1/medication", medicationRoutes);
export default router;
