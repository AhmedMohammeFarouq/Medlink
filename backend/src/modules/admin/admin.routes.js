import express from "express";
import { adminController } from "./admin.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

// Temporary admin authorization – SYSTEM_ADMIN role from User model
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

// Doctor verification
router.get("/doctors/pending", adminController.getPendingDoctors);
router.get("/doctors/:doctorId", adminController.getDoctorById);
router.patch("/doctors/:doctorId/approve", adminController.approveDoctor);
router.patch("/doctors/:doctorId/reject", adminController.rejectDoctor);

// User management
router.get("/users", adminController.getUsers);
router.get("/users/:userId", adminController.getUserById);
router.patch("/users/:userId/status", adminController.updateUserStatus);

// Statistics
router.get("/statistics", adminController.getBasicStatistics);

export default router;
