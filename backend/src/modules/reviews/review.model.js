import mongoose from "mongoose";
import { REVIEW_STATUS } from "./review.types.js";

const reviewSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: Object.values(REVIEW_STATUS),
      default: REVIEW_STATUS.ACTIVE,
    },
  },
  {
    timestamps: true,
  },
);

reviewSchema.index({ appointmentId: 1, patientId: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
