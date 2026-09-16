import mongoose from "mongoose";

const prescriptionSchema  = new mongoose.Schema(
  {
    patientId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
     patientName: { type: String, trim: true },

    diagnosis: { type: String, trim: true }, 

    issueDate: { type: Date, default: Date.now },
    medications: {
      type: [
        {
          medicationName: { type: String, required: true, trim: true },
          dosage: { type: String, required: true, trim: true },
          frequency: { type: String, required: true, trim: true },
          route: { type: String, trim: true },
          duration: { type: String, trim: true },
          instructions: { type: String, trim: true },
        },
      ],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "At least one medication is required",
      },
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
      enum: ["ACTIVE", "INACTIVE", "DISCONTINUED"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  },
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);

export default Prescription;
