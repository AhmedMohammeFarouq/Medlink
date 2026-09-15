import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            default: null,
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

        encounterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Encounter",
            default: null,
        },

        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        type: {
            type: String,
            enum: [
                "MEDICAL_REPORT",
                "LAB_RESULT",
                "IMAGING",
                "PRESCRIPTION",
                "MEDICAL_CERTIFICATE",
                "INSURANCE",
                "IDENTITY",
                "OTHER",
            ],
            required: true,
        },

        mimeType: {
            type: String,
            trim: true,
        },

        fileName: {
            type: String,
            trim: true,
        },

        fileUrl: {
            type: String,
            required: true,
            trim: true,
        },

        publicId: {
            type: String,
            trim: true,
            default: null,
        },

        fileSize: {
            type: Number,
            min: 0,
        },

        description: {
            type: String,
            trim: true,
        },

        issuedAt: {
            type: Date,
            default: null,
        },

        status: {
            type: String,
            enum: [
                "ACTIVE",
                "ARCHIVED",
                "DELETED",
            ],
            default: "ACTIVE",
        },

        visibility: {
            type: String,
            enum: [
                "PRIVATE",
                "PATIENT",
                "DOCTOR",
                "SHARED",
            ],
            default: "PRIVATE",
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

const Document = mongoose.model(
    "Document",
    documentSchema
);

export default Document;