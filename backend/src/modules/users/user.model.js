import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
            minlength: [2, "First name must be at least 2 characters"],
            maxlength: [50, "First name must not exceed 50 characters"],
        },

        lastName: {
            type: String,
            required: [true, "Last name is required"],
            trim: true,
            minlength: [2, "Last name must be at least 2 characters"],
            maxlength: [50, "Last name must not exceed 50 characters"],
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            maxlength: [254, "Email must not exceed 254 characters"],
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Please provide a valid email",
            ],
        },

        phone: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
            match: [
                /^01[0125][0-9]{8}$/,
                "Phone must be a valid Egyptian mobile number",
            ],
        },

        passwordHash: {
            type: String,
            required: [true, "Password hash is required"],
            select: false,
        },

        role: {
            type: String,
            enum: {
                values: [
                    "PATIENT",
                    "DOCTOR",
                    "RECEPTIONIST",
                    "CLINIC_ADMIN",
                    "SYSTEM_ADMIN",
                ],
                message: "Invalid user role",
            },
            required: [true, "User role is required"],
            default: "PATIENT",
        },

        status: {
            type: String,
            enum: {
                values: [
                    "ACTIVE",
                    "INACTIVE",
                    "SUSPENDED",
                    "PENDING",
                    "DELETED",
                ],
                message: "Invalid user status",
            },
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
            trim: true,
            maxlength: [500, "Profile image URL must not exceed 500 characters"],
        },

        gender: {
            type: String,
            enum: {
                values: ["MALE", "FEMALE", "OTHER"],
                message: "Invalid gender",
            },
        },

        dateOfBirth: {
            type: Date,
            validate: {
                validator: function (value) {
                    return value <= new Date();
                },
                message: "Date of birth cannot be in the future",
            },
        },

        lastLoginAt: {
            type: Date,
            default: null,
        },

        lastLoginIp: {
            type: String,
            default: null,
            trim: true,
            maxlength: [45, "IP address is invalid"],
        },

        passwordChangedAt: {
            type: Date,
            default: null,
        },
        passwordResetTokenHash: {
            type: String,
            default: null,
            select: false,
        },

        passwordResetExpiresAt: {
            type: Date,
            default: null,
            select: false,
        },
        emailVerificationCodeHash: {
            type: String,
            default: null,
            select: false,
        },

        emailVerificationCodeExpiresAt: {
            type: Date,
            default: null,
            select: false,
        },
        failedLoginAttempts: {
            type: Number,
            default: 0,
        },

        accountLockedUntil: {
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