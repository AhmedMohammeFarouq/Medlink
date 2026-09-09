import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },

        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            default: null,
        },

        clinicId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Clinic",
            default: null,
        },

        appointmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
            default: null,
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },

        title: {
            type: String,
            trim: true,
            maxlength: 150,
        },

        comment: {
            type: String,
            trim: true,
            maxlength: 1000,
        },

        status: {
            type: String,
            enum: [
                "PENDING",
                "PUBLISHED",
                "HIDDEN",
                "REJECTED",
            ],
            default: "PENDING",
        },

        isAnonymous: {
            type: Boolean,
            default: false,
        },

        response: {
            text: {
                type: String,
                trim: true,
                maxlength: 1000,
                default: null,
            },

            respondedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: null,
            },

            respondedAt: {
                type: Date,
                default: null,
            },
        },

        moderatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        moderatedAt: {
            type: Date,
            default: null,
        },

        moderationReason: {
            type: String,
            trim: true,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;