import { adminService, ApiError } from "./admin.service.js";
import { successResponse } from "../../utils/apiResponse.js";

export const adminController = {
  // ---- Doctor Verification ----
  async getPendingDoctors(req, res, next) {
    try {
      const doctors = await adminService.getPendingDoctors();
      return successResponse({ res, statusCode: 200, data: doctors });
    } catch (error) {
      next(error);
    }
  },

  async getDoctorById(req, res, next) {
    try {
      const doctor = await adminService.getDoctorById(req.params.doctorId);
      return successResponse({ res, statusCode: 200, data: doctor });
    } catch (error) {
      next(error);
    }
  },

  async approveDoctor(req, res, next) {
    try {
      const adminId = req.user.userId;
      const doctor = await adminService.approveDoctor(
        req.params.doctorId,
        adminId,
      );
      return successResponse({ res, statusCode: 200, data: doctor });
    } catch (error) {
      next(error);
    }
  },

  async rejectDoctor(req, res, next) {
    try {
      const adminId = req.user.userId;
      const { reason } = req.body;
      const doctor = await adminService.rejectDoctor(
        req.params.doctorId,
        adminId,
        reason,
      );
      return successResponse({ res, statusCode: 200, data: doctor });
    } catch (error) {
      next(error);
    }
  },

  // ---- User Management ----
  async getUsers(req, res, next) {
    try {
      const { page = 1, limit = 10, ...filters } = req.query;
      const skip = (page - 1) * limit;
      const result = await adminService.getUsers(filters, {
        skip,
        limit: parseInt(limit),
      });
      return successResponse({ res, statusCode: 200, data: result });
    } catch (error) {
      next(error);
    }
  },

  async getUserById(req, res, next) {
    try {
      const user = await adminService.getUserById(req.params.userId);
      return successResponse({ res, statusCode: 200, data: user });
    } catch (error) {
      next(error);
    }
  },

  async updateUserStatus(req, res, next) {
    try {
      const { userId } = req.params;
      const { status } = req.body;
      const updated = await adminService.updateUserStatus(userId, status);
      return successResponse({ res, statusCode: 200, data: updated });
    } catch (error) {
      next(error);
    }
  },

  // ---- Statistics ----
  async getBasicStatistics(req, res, next) {
    try {
      const stats = await adminService.getBasicStatistics();
      return successResponse({ res, statusCode: 200, data: stats });
    } catch (error) {
      next(error);
    }
  },
};
