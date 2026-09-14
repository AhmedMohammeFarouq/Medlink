import { reviewService } from "./review.service.js";
import { validationResult } from "express-validator";
import { successResponse } from "../../utils/apiResponse.js";

export const reviewController = {
  async createReview(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }
      const { doctorId, appointmentId, rating, comment } = req.body;
      const patientId = req.user.userId;
      const review = await reviewService.createReview(
        { patientId, doctorId, appointmentId, rating, comment },
        req.user.userId,
      );
      return successResponse({
        res,
        statusCode: 201,
        message: "Review created",
        data: review,
      });
    } catch (error) {
      next(error);
    }
  },

  async getReviews(req, res, next) {
    try {
      const { doctorId, patientId, status, page = 1, limit = 20 } = req.query;
      const skip = (page - 1) * limit;
      const filters = {};
      if (doctorId) filters.doctorId = doctorId;
      if (patientId) filters.patientId = patientId;
      if (status) filters.status = status;
      const result = await reviewService.getReviews(filters, {
        skip,
        limit: parseInt(limit),
      });
      return successResponse({
        res,
        statusCode: 200,
        message: "Reviews retrieved",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async getReviewById(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }
      const review = await reviewService.getReviewById(req.params.reviewId);
      return successResponse({
        res,
        statusCode: 200,
        message: "Review retrieved",
        data: review,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateReview(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }
      const { reviewId } = req.params;
      const updates = req.body;
      const updated = await reviewService.updateReview(
        reviewId,
        updates,
        req.user.userId,
      );
      return successResponse({
        res,
        statusCode: 200,
        message: "Review updated",
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteReview(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }
      const { reviewId } = req.params;
      const deleted = await reviewService.deleteReview(
        reviewId,
        req.user.userId,
      );
      return successResponse({
        res,
        statusCode: 200,
        message: "Review deleted",
        data: deleted,
      });
    } catch (error) {
      next(error);
    }
  },

  async getReviewsForDoctor(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }
      const { doctorId } = req.params;
      const { page = 1, limit = 20 } = req.query;
      const skip = (page - 1) * limit;
      const result = await reviewService.getReviewsForDoctor(doctorId, {
        skip,
        limit: parseInt(limit),
      });
      return successResponse({
        res,
        statusCode: 200,
        message: "Doctor reviews retrieved",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
