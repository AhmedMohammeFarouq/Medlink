import mongoose from "mongoose";

const medicationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        genericName: {
            type: String,
            trim: true,
        },

        brandName: {
            type: String,
            trim: true,
        },

        activeIngredients: [
            {
                name: {
                    type: String,
                    trim: true,
                },

                strength: {
                    type: String,
                    trim: true,
                },
            },
        ],

        dosageForm: {
            type: String,
            enum: [
                "TABLET",
                "CAPSULE",
                "SYRUP",
                "SOLUTION",
                "SUSPENSION",
                "CREAM",
                "OINTMENT",
                "GEL",
                "INJECTION",
                "DROPS",
                "INHALER",
                "PATCH",
                "OTHER",
            ],
        },

        route: {
            type: String,
            enum: [
                "ORAL",
                "TOPICAL",
                "INTRAVENOUS",
                "INTRAMUSCULAR",
                "SUBCUTANEOUS",
                "INHALATION",
                "OPHTHALMIC",
                "OTIC",
                "NASAL",
                "RECTAL",
                "VAGINAL",
                "OTHER",
            ],
        },

        manufacturer: {
            type: String,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        indications: [
            {
                type: String,
                trim: true,
            },
        ],

        contraindications: [
            {
                type: String,
                trim: true,
            },
        ],

        sideEffects: [
            {
                type: String,
                trim: true,
            },
        ],

        warnings: [
            {
                type: String,
                trim: true,
            },
        ],

        storageInstructions: {
            type: String,
            trim: true,
        },

        prescriptionRequired: {
            type: Boolean,
            default: true,
        },

        status: {
            type: String,
            enum: [
                "ACTIVE",
                "INACTIVE",
                "DISCONTINUED",
            ],
            default: "ACTIVE",
        },
    },
    {
        timestamps: true,
    }
);

const Medication = mongoose.model(
    "Medication",
    medicationSchema
);

export default Medication;