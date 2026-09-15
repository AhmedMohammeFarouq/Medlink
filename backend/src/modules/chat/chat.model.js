import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        ],

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

        type: {
            type: String,
            enum: [
                "PATIENT_DOCTOR",
                "PATIENT_CLINIC",
                "DOCTOR_CLINIC",
                "GROUP",
            ],
            default: "PATIENT_DOCTOR",
        },

        lastMessageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: null,
        },

        lastMessageAt: {
            type: Date,
            default: null,
        },

        status: {
            type: String,
            enum: [
                "ACTIVE",
                "ARCHIVED",
                "BLOCKED",
            ],
            default: "ACTIVE",
        },
    },
    {
        timestamps: true,
    }
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;