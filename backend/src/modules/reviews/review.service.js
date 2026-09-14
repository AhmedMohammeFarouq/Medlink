import Review from "./review.model.js";
import { REVIEW_STATUS } from "./review.types.js";
import { AuditService } from "../audit/audit.services.js";
import { ApiError } from "../admin/admin.service.js";
import Doctor from "../doctors/doctor.model.js";
import User from "../users/user.model.js";
import Appointment from "../appointments/appointment.model.js";

class ReviewService {
  // ----- Validation helpers -----
  async validatePatientExists(patientId) {
    const user = await User.findOne({ _id: patientId, role: "PATIENT" });
    if (!user) throw new ApiError(404, "Patient not found");
    return user;
  }

  async validateDoctorExists(doctorId) {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) throw new ApiError(404, "Doctor not found");
    return doctor;
  }

  async validateAppointmentForReview(appointmentId, patientId, doctorId) {
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      patientId,
      doctorId,
      status: "COMPLETED",
    });
    if (!appointment) {
      throw new ApiError(
        400,
        "Appointment must exist, belong to the patient/doctor, and be completed",
      );
    }
    const existing = await Review.findOne({
      appointmentId,
      patientId,
      status: { $ne: REVIEW_STATUS.DELETED },
    });
    if (existing) throw new ApiError(409, "Appointment already reviewed");
    return appointment;
  }

  // ----- CRUD -----
  async createReview(data, actorId) {
    const { patientId, doctorId, appointmentId, rating, comment } = data;
    await this.validatePatientExists(patientId);
    await this.validateDoctorExists(doctorId);
    await this.validateAppointmentForReview(appointmentId, patientId, doctorId);

    const review = new Review({
      patientId,
      doctorId,
      appointmentId,
      rating,
      comment: comment || "",
    });
    await review.save();
    await this.updateDoctorRating(doctorId);

    await AuditService.log({
      actorId,
      action: "REVIEW_CREATED",
      resourceType: "Review",
      resourceId: review._id,
      metadata: { review },
    });
    return review;
  }

  async getReviews(filters = {}, pagination = {}) {
    const { doctorId, patientId, status } = filters;
    const query = {};
    if (doctorId) query.doctorId = doctorId;
    if (patientId) query.patientId = patientId;
    if (status) query.status = status;
    if (!query.status) query.status = { $ne: REVIEW_STATUS.DELETED };

    const { skip = 0, limit = 20 } = pagination;
    const [reviews, total] = await Promise.all([
      Review.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Review.countDocuments(query),
    ]);
    return { data: reviews, total, page: Math.floor(skip / limit) + 1, limit };
  }

  async getReviewById(reviewId) {
    const review = await Review.findById(reviewId);
    if (!review) throw new ApiError(404, "Review not found");
    return review;
  }

  async updateReview(reviewId, updates, actorId) {
    const review = await this.getReviewById(reviewId);
    if (review.status === REVIEW_STATUS.DELETED) {
      throw new ApiError(400, "Cannot update a deleted review");
    }
    if (updates.rating) review.rating = updates.rating;
    if (updates.comment !== undefined) review.comment = updates.comment;
    if (updates.status) review.status = updates.status;
    await review.save();

    if (updates.rating) await this.updateDoctorRating(review.doctorId);

    await AuditService.log({
      actorId,
      action: "REVIEW_UPDATED",
      resourceType: "Review",
      resourceId: review._id,
      metadata: { updates, reviewId },
    });
    return review;
  }

  async deleteReview(reviewId, actorId) {
    const review = await this.getReviewById(reviewId);
    if (review.status === REVIEW_STATUS.DELETED) {
      throw new ApiError(400, "Review already deleted");
    }
    review.status = REVIEW_STATUS.DELETED;
    await review.save();
    await this.updateDoctorRating(review.doctorId);

    await AuditService.log({
      actorId,
      action: "REVIEW_DELETED",
      resourceType: "Review",
      resourceId: review._id,
      metadata: { reviewId },
    });
    return review;
  }

  async getReviewsForDoctor(doctorId, pagination = {}) {
    return this.getReviews(
      { doctorId, status: REVIEW_STATUS.ACTIVE },
      pagination,
    );
  }

  // ----- Doctor rating update (can be replaced by Member 3's service) -----
  async updateDoctorRating(doctorId) {
    const result = await Review.aggregate([
      { $match: { doctorId, status: REVIEW_STATUS.ACTIVE } },
      { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);
    const average = result.length > 0 ? result[0].avg : 0;
    const count = result.length > 0 ? result[0].count : 0;
    await Doctor.findByIdAndUpdate(doctorId, {
      "rating.average": Math.round(average * 10) / 10,
      "rating.count": count,
    });
  }
}

export const reviewService = new ReviewService();
