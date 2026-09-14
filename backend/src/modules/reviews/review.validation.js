import { body, param, query } from "express-validator";
import { REVIEW_STATUS } from "./review.types.js";

export const createReviewValidation = [
  body("doctorId").isMongoId().withMessage("Invalid doctor ID"),
  body("appointmentId").isMongoId().withMessage("Invalid appointment ID"),
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be 1–5"),
  body("comment").optional().isString().trim().isLength({ max: 1000 }),
];

export const updateReviewValidation = [
  param("reviewId").isMongoId(),
  body("rating").optional().isInt({ min: 1, max: 5 }),
  body("comment").optional().isString().trim().isLength({ max: 1000 }),
  body("status").optional().isIn(Object.values(REVIEW_STATUS)),
];

export const getReviewByIdValidation = [param("reviewId").isMongoId()];

export const deleteReviewValidation = [param("reviewId").isMongoId()];

export const getDoctorReviewsValidation = [
  param("doctorId").isMongoId(),
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
];
