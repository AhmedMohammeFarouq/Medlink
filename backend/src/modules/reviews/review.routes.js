import express from "express";
import { reviewController } from "./review.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import {
  createReviewValidation,
  updateReviewValidation,
  getReviewByIdValidation,
  deleteReviewValidation,
  getDoctorReviewsValidation,
} from "./review.validation.js";

const router = express.Router();

// Public / semi‑public endpoints
router.get(
  "/doctor/:doctorId",
  getDoctorReviewsValidation,
  reviewController.getReviewsForDoctor,
);
router.get("/", reviewController.getReviews);
router.get(
  "/:reviewId",
  getReviewByIdValidation,
  reviewController.getReviewById,
);

// Authenticated endpoints
router.post(
  "/",
  authMiddleware,
  createReviewValidation,
  reviewController.createReview,
);
router.patch(
  "/:reviewId",
  authMiddleware,
  updateReviewValidation,
  reviewController.updateReview,
);
router.delete(
  "/:reviewId",
  authMiddleware,
  deleteReviewValidation,
  reviewController.deleteReview,
);

export default router;
