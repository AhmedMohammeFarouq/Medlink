import express from "express";
import * as notificationController from "./notification.controller.js";
import authMiddleware  from "../../middlewares/auth.middleware.js";

const router = express.Router();
router.use(authMiddleware);

router.get("/",notificationController.listMyNotifications); // if ?unreadOly=true => unread notifications only or false => all notification
router.patch("/readOne/:notificationId",notificationController.markAsRead);
router.patch("/readAll",notificationController.markAllAsRead);


export default router;
