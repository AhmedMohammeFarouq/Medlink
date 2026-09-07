import { Router } from "express";
import authRouter from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/users/user.routes.js";

const router = Router();

router.use("/v1/auth", authRouter);
router.use("/v1/users", userRoutes);
export default router;