import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        healthId: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
        },

        dateOfBirth: {
            type: Date,
        },

        gender: {
            type: String,
            enum: ["MALE", "FEMALE", "OTHER"],
        },

        bloodType: {
            type: String,
            enum: [
                "A_POSITIVE",
                "A_NEGATIVE",
                "B_POSITIVE",
                "B_NEGATIVE",
                "AB_POSITIVE",
                "AB_NEGATIVE",
                "O_POSITIVE",
                "O_NEGATIVE",
                "UNKNOWN",
            ],
            default: "UNKNOWN",
        },

        height: {
            type: Number,
            min: 0,
        },

        weight: {
            type: Number,
            min: 0,
        },

        allergies: [
            {
                name: {
                    type: String,
                    trim: true,
                },

                severity: {
                    type: String,
                    enum: ["MILD", "MODERATE", "SEVERE"],
                },

                reaction: {
                    type: String,
                    trim: true,
                },

                diagnosedAt: {
                    type: Date,
                },
            },
        ],

        conditions: [
            {
                name: {
                    type: String,
                    trim: true,
                },

                status: {
                    type: String,
                    enum: ["ACTIVE", "RESOLVED", "CHRONIC", "INACTIVE"],
                },

                diagnosedAt: {
                    type: Date,
                },

                notes: {
                    type: String,
                    trim: true,
                },
            },
        ],

        surgeries: [
            {
                name: {
                    type: String,
                    trim: true,
                },

                date: {
                    type: Date,
                },

                hospital: {
                    type: String,
                    trim: true,
                },

                notes: {
                    type: String,
                    trim: true,
                },
            },
        ],

        emergencyContact: {
            name: {
                type: String,
                trim: true,
            },

            relationship: {
                type: String,
                trim: true,
            },

            phone: {
                type: String,
                trim: true,
            },

            alternatePhone: {
                type: String,
                trim: true,
            },
        },

        address: {
            country: {
                type: String,
                trim: true,
            },

            governorate: {
                type: String,
                trim: true,
            },

            city: {
                type: String,
                trim: true,
            },

            area: {
                type: String,
                trim: true,
            },

            addressLine: {
                type: String,
                trim: true,
            },
        },

        insurance: {
            provider: {
                type: String,
                trim: true,
            },

            policyNumber: {
                type: String,
                trim: true,
            },

            memberId: {
                type: String,
                trim: true,
            },

            expiryDate: {
                type: Date,
            },
        },

        preferredLanguage: {
            type: String,
            default: "en",
            trim: true,
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

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;