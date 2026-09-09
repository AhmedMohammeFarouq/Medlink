import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        chatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",
            required: true,
        },

        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        content: {
            type: String,
            trim: true,
            default: null,
        },

        type: {
            type: String,
            enum: [
                "TEXT",
                "IMAGE",
                "FILE",
                "SYSTEM",
            ],
            default: "TEXT",
        },

        attachment: {
            fileName: {
                type: String,
                default: null,
            },

            fileUrl: {
                type: String,
                default: null,
            },

            mimeType: {
                type: String,
                default: null,
            },

            fileSize: {
                type: Number,
                default: null,
            },
        },

        isRead: {
            type: Boolean,
            default: false,
        },

        readAt: {
            type: Date,
            default: null,
        },

        isDeleted: {
            type: Boolean,
            default: false,
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

const Message = mongoose.model("Message", messageSchema);

export default Message;