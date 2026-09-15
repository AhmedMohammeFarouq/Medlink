import express from "express";
import * as chatController from "./chat.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
const router = express.Router();
router.use(authMiddleware);

router.post("/rooms/create", chatController.createOrGetRoom);
router.get("/rooms/myRooms", chatController.listMyRooms);
router.get("/rooms/myRooms/:roomId", chatController.getRoom);
router.patch("/rooms/myRooms/:roomId/close", chatController.closeRoom);

router.get("/rooms/myRooms/:roomId/messages", chatController.getMessages);
router.post("/rooms/myRooms/:roomId/messages", chatController.sendMessage);
router.patch("/rooms/myRooms/:roomId/read", chatController.markAsRead);

export default router;
