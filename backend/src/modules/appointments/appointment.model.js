import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },

        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true,
        },

        clinicId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Clinic",
            required: true,
        },

        scheduledAt: {
            type: Date,
            required: true,
        },

        duration: {
            type: Number,
            min: 1,
            default: 30,
        },

        type: {
            type: String,
            enum: [
                "IN_PERSON",
                "ONLINE",
                "FOLLOW_UP",
            ],
            default: "IN_PERSON",
        },

        status: {
            type: String,
            enum: [
                "PENDING",
                "CONFIRMED",
                "COMPLETED",
                "CANCELLED",
                "NO_SHOW",
                "RESCHEDULED",
            ],
            default: "PENDING",
        },

        reason: {
            type: String,
            trim: true,
        },

        notes: {
            type: String,
            trim: true,
        },

        cancellation: {
            cancelledBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: null,
            },

            cancelledAt: {
                type: Date,
                default: null,
            },

            reason: {
                type: String,
                trim: true,
                default: null,
            },
        },

        rescheduledFrom: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
            default: null,
        },

        onlineMeeting: {
            meetingUrl: {
                type: String,
                default: null,
            },

            meetingId: {
                type: String,
                default: null,
            },

            startedAt: {
                type: Date,
                default: null,
            },

            endedAt: {
                type: Date,
                default: null,
            },
        },

        reminder: {
            sent: {
                type: Boolean,
                default: false,
            },

            sentAt: {
                type: Date,
                default: null,
            },
        },
    },
    {
        timestamps: true,
    }
);

const Appointment = mongoose.model(
    "Appointment",
    appointmentSchema
);

export default Appointment;