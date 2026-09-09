import mongoose from "mongoose";

const clinicSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        type: {
            type: String,
            enum: [
                "CLINIC",
                "MEDICAL_CENTER",
                "HOSPITAL",
            ],
            default: "CLINIC",
        },

        description: {
            type: String,
            trim: true,
        },

        contact: {
            phone: {
                type: String,
                trim: true,
            },

            email: {
                type: String,
                lowercase: true,
                trim: true,
            },

            website: {
                type: String,
                trim: true,
            },
        },

        address: {
            country: {
                type: String,
                trim: true,
                default: "Egypt",
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

            latitude: {
                type: Number,
            },

            longitude: {
                type: Number,
            },
        },

        services: [
            {
                type: String,
                trim: true,
            },
        ],

        specialties: [
            {
                type: String,
                trim: true,
            },
        ],

        doctors: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Doctor",
            },
        ],

        workingHours: [
            {
                day: {
                    type: String,
                    enum: [
                        "SATURDAY",
                        "SUNDAY",
                        "MONDAY",
                        "TUESDAY",
                        "WEDNESDAY",
                        "THURSDAY",
                        "FRIDAY",
                    ],
                },

                openTime: {
                    type: String,
                },

                closeTime: {
                    type: String,
                },

                isOpen: {
                    type: Boolean,
                    default: true,
                },
            },
        ],

        verification: {
            status: {
                type: String,
                enum: [
                    "PENDING",
                    "DOCUMENTS_SUBMITTED",
                    "UNDER_REVIEW",
                    "APPROVED",
                    "REJECTED",
                ],
                default: "PENDING",
            },

            verifiedAt: {
                type: Date,
                default: null,
            },

            verifiedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: null,
            },

            rejectionReason: {
                type: String,
                trim: true,
                default: null,
            },

            documents: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Document",
                },
            ],
        },

        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        status: {
            type: String,
            enum: [
                "ACTIVE",
                "INACTIVE",
                "SUSPENDED",
                "PENDING",
            ],
            default: "PENDING",
        },
    },
    {
        timestamps: true,
    }
);

const Clinic = mongoose.model("Clinic", clinicSchema);

export default Clinic;