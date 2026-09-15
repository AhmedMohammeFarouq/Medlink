import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            trim: true,
            maxlength: 50,
        },

        lastName: {
            type: String,
            trim: true,
            maxlength: 50,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        phone: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
        },

        passwordHash: {
            type: String,
        },

        role: {
            type: String,
            enum: [
                "PATIENT",
                "DOCTOR",
                "RECEPTIONIST",
                "CLINIC_ADMIN",
                "SYSTEM_ADMIN",
            ],
            required: true,
            default: "PATIENT",
        },

        status: {
            type: String,
            enum: [
                "ACTIVE",
                "INACTIVE",
                "SUSPENDED",
                "PENDING",
                "DELETED",
            ],
            default: "PENDING",
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        isEmailVerified: {
            type: Boolean,
            default: false,
        },

        isPhoneVerified: {
            type: Boolean,
            default: false,
        },

        profileImage: {
            type: String,
            default: null,
        },

        gender: {
            type: String,
            enum: ["MALE", "FEMALE", "OTHER"],
        },

        dateOfBirth: {
            type: Date,
        },

        lastLoginAt: {
            type: Date,
            default: null,
        },

        lastLoginIp: {
            type: String,
            default: null,
        },

        passwordChangedAt: {
            type: Date,
            default: null,
        },

        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("User", userSchema);