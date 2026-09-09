import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        professionalInfo: {
            medicalDegree: {
                type: String,
                trim: true,
            },

            specialty: {
                type: String,
                required: true,
                trim: true,
            },

            subSpecialty: {
                type: String,
                trim: true,
            },

            licenseNumber: {
                type: String,
                trim: true,
            },

            yearsOfExperience: {
                type: Number,
                min: 0,
            },

            bio: {
                type: String,
                trim: true,
            },

            languages: [
                {
                    type: String,
                    trim: true,
                },
            ],
        },

        clinics: [
            {
                clinicId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Clinic",
                },

                consultationFee: {
                    type: Number,
                    min: 0,
                },

                appointmentDuration: {
                    type: Number,
                    min: 1,
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

        availability: {
            timezone: {
                type: String,
                default: "Africa/Cairo",
            },

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

                    startTime: {
                        type: String,
                    },

                    endTime: {
                        type: String,
                    },

                    isAvailable: {
                        type: Boolean,
                        default: true,
                    },
                },
            ],
        },

        rating: {
            average: {
                type: Number,
                min: 0,
                max: 5,
                default: 0,
            },

            count: {
                type: Number,
                min: 0,
                default: 0,
            },
        },

        profileStatus: {
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

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;