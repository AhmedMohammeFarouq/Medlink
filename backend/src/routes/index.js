import { Router } from "express";
import authRouter from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/users/user.routes.js";
import adminRoutes from '../modules/admin/admin.routes.js';
import reviewRoutes from '../modules/reviews/review.routes.js';
import auditRoutes from '../modules/audit/audit.routes.js';

const router = Router();

router.use("/v1/auth", authRouter);
router.use("/v1/users", userRoutes);
router.use('/v1/admin', adminRoutes);
router.use('/v1/reviews', reviewRoutes);
router.use('/v1/audit', auditRoutes);
export default router;
