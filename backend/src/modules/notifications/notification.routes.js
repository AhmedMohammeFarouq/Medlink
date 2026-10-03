import express from "express";
import * as notificationController from "./notification.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = express.Router();
router.use(authMiddleware);

router.get("/", notificationController.listMyNotifications);
router.patch("/readOne/:notificationId", notificationController.markAsRead);
router.patch("/:notificationId/read", notificationController.markAsRead);
router.patch("/readAll", notificationController.markAllAsRead);
router.patch("/mark-all-read", notificationController.markAllAsRead);

export default router;
