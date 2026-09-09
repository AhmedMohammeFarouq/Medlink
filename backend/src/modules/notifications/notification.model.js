import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        recipientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        type: {
            type: String,
            enum: [
                "APPOINTMENT",
                "APPOINTMENT_REMINDER",
                "APPOINTMENT_CANCELLED",
                "APPOINTMENT_RESCHEDULED",
                "MESSAGE",
                "PRESCRIPTION",
                "MEDICAL_RECORD",
                "CONSENT",
                "REVIEW",
                "SYSTEM",
                "OTHER",
            ],
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        message: {
            type: String,
            required: true,
            trim: true,
        },

        relatedEntity: {
            entityType: {
                type: String,
                enum: [
                    "APPOINTMENT",
                    "CHAT",
                    "MESSAGE",
                    "PRESCRIPTION",
                    "MEDICAL_RECORD",
                    "CONSENT",
                    "REVIEW",
                    "DOCUMENT",
                    "OTHER",
                ],
                default: null,
            },

            entityId: {
                type: mongoose.Schema.Types.ObjectId,
                default: null,
            },
        },

        isRead: {
            type: Boolean,
            default: false,
        },

        readAt: {
            type: Date,
            default: null,
        },

        actionUrl: {
            type: String,
            default: null,
            trim: true,
        },

        priority: {
            type: String,
            enum: [
                "LOW",
                "NORMAL",
                "HIGH",
                "URGENT",
            ],
            default: "NORMAL",
        },

        expiresAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Notification = mongoose.model(
    "Notification",
    notificationSchema
);

export default Notification;