import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
            unique: true,
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

        allergies: [
            {
                name: {
                    type: String,
                    trim: true,
                },

                reaction: {
                    type: String,
                    trim: true,
                },

                severity: {
                    type: String,
                    enum: ["MILD", "MODERATE", "SEVERE"],
                },
            },
        ],

        chronicConditions: [
            {
                name: {
                    type: String,
                    trim: true,
                },

                diagnosedAt: {
                    type: Date,
                },

                status: {
                    type: String,
                    enum: ["ACTIVE", "RESOLVED", "CHRONIC", "INACTIVE"],
                    default: "ACTIVE",
                },

                notes: {
                    type: String,
                    trim: true,
                },
            },
        ],

        familyHistory: [
            {
                condition: {
                    type: String,
                    trim: true,
                },

                relationship: {
                    type: String,
                    trim: true,
                },

                notes: {
                    type: String,
                    trim: true,
                },
            },
        ],

        surgicalHistory: [
            {
                procedure: {
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

        lifestyle: {
            smoking: {
                type: String,
                enum: ["NEVER", "FORMER", "CURRENT", "UNKNOWN"],
            },

            alcohol: {
                type: String,
                enum: ["NEVER", "FORMER", "CURRENT", "UNKNOWN"],
            },

            exercise: {
                type: String,
                trim: true,
            },

            diet: {
                type: String,
                trim: true,
            },
        },

        notes: {
            type: String,
            trim: true,
        },

        lastUpdatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const MedicalRecord = mongoose.model(
    "MedicalRecord",
    medicalRecordSchema
);

export default MedicalRecord;