import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
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

        encounterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Encounter",
            default: null,
        },

        appointmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
            default: null,
        },

        clinicId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Clinic",
            default: null,
        },

        prescriptionNumber: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
        },

        medications: [
            {
                medicationId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Medication",
                    required: true,
                },

                medicationName: {
                    type: String,
                    trim: true,
                },

                dosage: {
                    type: String,
                    trim: true,
                },

                frequency: {
                    type: String,
                    trim: true,
                },

                route: {
                    type: String,
                    trim: true,
                },

                duration: {
                    type: String,
                    trim: true,
                },

                quantity: {
                    type: Number,
                    min: 0,
                },

                instructions: {
                    type: String,
                    trim: true,
                },

                notes: {
                    type: String,
                    trim: true,
                },
            },
        ],

        diagnosis: [
            {
                type: String,
                trim: true,
            },
        ],

        notes: {
            type: String,
            trim: true,
        },

        issuedAt: {
            type: Date,
            default: Date.now,
        },

        expiresAt: {
            type: Date,
            default: null,
        },

        status: {
            type: String,
            enum: [
                "ACTIVE",
                "COMPLETED",
                "EXPIRED",
                "CANCELLED",
            ],
            default: "ACTIVE",
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        cancelledBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        cancelledAt: {
            type: Date,
            default: null,
        },

        cancellationReason: {
            type: String,
            trim: true,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Prescription = mongoose.model(
    "Prescription",
    prescriptionSchema
);

export default Prescription;