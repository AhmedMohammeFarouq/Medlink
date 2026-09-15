import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        tokenHash: {
            type: String,
            required: true,
        },

        expiresAt: {
            type: Date,
            required: true,
        },

        revokedAt: {
            type: Date,
            default: null,
        },

        lastUsedAt: {
            type: Date,
            default: null,
        },
        deviceInfo: {
            type: String,
            trim: true,
            maxlength: 500,
        },

        ipAddress: {
            type: String,
            trim: true,
            maxlength: 45,
        },

        userAgent: {
            type: String,
            trim: true,
            maxlength: 1000,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Session", sessionSchema);