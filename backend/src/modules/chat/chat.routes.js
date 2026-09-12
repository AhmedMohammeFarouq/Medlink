import express from "express";
import * as chatController from "./chat.controller.js";
import  authMiddleware  from "../../middlewares/auth.middleware.js";

const router = express.Router();
router.use(authMiddleware);

router.post("/rooms", chatController.createOrGetRoom);
router.get("/rooms", chatController.listMyRooms);
router.get("/rooms/:roomId", chatController.getRoom);
router.patch("/rooms/:roomId/close", chatController.closeRoom);

router.get("/rooms/:roomId/messages", chatController.getMessages);
router.post("/rooms/:roomId/messages", chatController.sendMessage);
router.patch("/rooms/:roomId/read", chatController.markAsRead);

export default router;
