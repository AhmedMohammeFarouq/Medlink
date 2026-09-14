import express from "express";
import { auditController } from "./audit.controllers.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const adminAuthorization = (req, res, next) => {
  if (req.user && req.user.role === "SYSTEM_ADMIN") {
    next();
  } else {
    res.status(403).json({ success: false, message: "Admin access required" });
  }
};

const router = express.Router();
router.use(authMiddleware);
router.use(adminAuthorization);

router.get("/", auditController.getLogs);
router.get("/:auditId", auditController.getLogById);

export default router;
