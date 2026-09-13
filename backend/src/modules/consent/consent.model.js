import mongoose from "mongoose";

const consentSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: ["PENDING", "GRANTED", "REVOKED"],
      default: "PENDING",
    },
    scope: { type: String, required: true },

    grantedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    grantedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: [
        "MEDICAL_RECORD_ACCESS",
        "DOCUMENT_ACCESS",
        "PRESCRIPTION_ACCESS",
        "CHAT_ACCESS",
        "FULL_ACCESS",
        "OTHER",
      ],
      required: true,
    },

    scope: [
      {
        type: String,
        enum: [
          "MEDICAL_RECORDS",
          "DOCUMENTS",
          "PRESCRIPTIONS",
          "APPOINTMENTS",
          "ENCOUNTERS",
          "PROFILE",
          "CHAT",
        ],
      },
    ],

    status: {
      type: String,
      enum: ["PENDING", "GRANTED", "REVOKED", "EXPIRED", "REJECTED"],
      default: "PENDING",
    },

    reason: {
      type: String,
      trim: true,
      default: null,
    },

    grantedAt: {
      type: Date,
      default: null,
    },

    expiresAt: {
      type: Date,
      default: null,
    },

    revokedAt: {
      type: Date,
      default: null,
    },

    revokedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    revocationReason: {
      type: String,
      trim: true,
      default: null,
    },

    notes: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Consent = mongoose.model("Consent", consentSchema);

export default Consent;
