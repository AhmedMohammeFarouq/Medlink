import { Router } from 'express';
import notificationRoutes from "../modules/notifications/notification.routes.js" ;
import chatRoutes from "../modules/chat/chat.routes.js"

const router = Router();
router.use("/notifications",notificationRoutes);
router.use("/chat",chatRoutes);

export default router;