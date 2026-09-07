import { Router } from "express";
import validationMiddleware from "../../middlewares/validation.middleware.js";
import * as authValidation from "./auth.validation.js";
import * as authController from "./auth.controller.js";

const router = Router();

router.post(
    "/register",
    validationMiddleware(authValidation.registerValidation),
    authController.register
);
router.post(
    "/login",
    validationMiddleware(authValidation.loginValidation),
    authController.loginController
);
router.post(
    "/refresh-token",
    validationMiddleware(authValidation.refreshTokenValidation),
    authController.refreshTokenController
);

router.post(
    "/logout",
    validationMiddleware(authValidation.logoutValidation),
    authController.logoutController
);

export default router;