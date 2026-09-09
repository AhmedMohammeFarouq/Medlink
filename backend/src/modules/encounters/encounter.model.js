import mongoose from "mongoose";

const encounterSchema = new mongoose.Schema(
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

        appointmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
            default: null,
        },

        medicalRecordId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MedicalRecord",
            required: true,
        },

        clinicId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Clinic",
            default: null,
        },

        type: {
            type: String,
            enum: [
                "CONSULTATION",
                "FOLLOW_UP",
                "EMERGENCY",
                "ONLINE",
                "IN_PERSON",
            ],
            default: "CONSULTATION",
        },

        status: {
            type: String,
            enum: [
                "OPEN",
                "IN_PROGRESS",
                "COMPLETED",
                "CANCELLED",
            ],
            default: "OPEN",
        },

        startedAt: {
            type: Date,
            default: null,
        },

        endedAt: {
            type: Date,
            default: null,
        },

        chiefComplaint: {
            type: String,
            trim: true,
        },

        symptoms: [
            {
                name: {
                    type: String,
                    trim: true,
                },

                duration: {
                    type: String,
                    trim: true,
                },

                severity: {
                    type: String,
                    enum: ["MILD", "MODERATE", "SEVERE"],
                },
            },
        ],

        clinicalNotes: {
            type: String,
            trim: true,
        },

        examination: {
            generalCondition: {
                type: String,
                trim: true,
            },

            vitalSigns: {
                temperature: {
                    type: Number,
                },

                heartRate: {
                    type: Number,
                },

                respiratoryRate: {
                    type: Number,
                },

                systolicBloodPressure: {
                    type: Number,
                },

                diastolicBloodPressure: {
                    type: Number,
                },

                oxygenSaturation: {
                    type: Number,
                },
            },

            findings: {
                type: String,
                trim: true,
            },
        },

        diagnosis: [
            {
                name: {
                    type: String,
                    trim: true,
                },

                code: {
                    type: String,
                    trim: true,
                },

                type: {
                    type: String,
                    enum: ["PRIMARY", "SECONDARY"],
                },

                notes: {
                    type: String,
                    trim: true,
                },
            },
        ],

        treatmentPlan: {
            type: String,
            trim: true,
        },

        followUp: {
            required: {
                type: Boolean,
                default: false,
            },

            date: {
                type: Date,
                default: null,
            },

            notes: {
                type: String,
                trim: true,
            },
        },

        prescriptions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Prescription",
            },
        ],

        documents: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Document",
            },
        ],

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Encounter = mongoose.model(
    "Encounter",
    encounterSchema
);

export default Encounter;