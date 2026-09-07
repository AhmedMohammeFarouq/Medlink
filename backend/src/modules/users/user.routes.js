import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import { getMyProfileController } from "./user.controller.js";

const router = Router();

router.get(
    "/me",
    authMiddleware,
    getMyProfileController
);

export default router;