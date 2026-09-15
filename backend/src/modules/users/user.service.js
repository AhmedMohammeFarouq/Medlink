import User from "./user.model.js";
import { uploadImage } from "../../config/cloudinary.js";
import {
    hashPassword,
    comparePassword,
} from "../../utils/hashPassword.js";
import { revokeAllUserSessions } from "../sessions/sessions.service.js";
export const getCurrentUser = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    return user;
};

export const updateProfile = async (userId, data, file) => {
    const user = await User.findById(userId);

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    const allowedFields = [
        "firstName",
        "lastName",
        "phone",
        "gender",
        "dateOfBirth",
    ];

    allowedFields.forEach((field) => {
        if (data[field] !== undefined) {
            user[field] =
                typeof data[field] === "string"
                    ? data[field].trim()
                    : data[field];
        }
    });

    if (data.phone !== undefined) {
        const existingPhone = await User.findOne({
            phone: data.phone.trim(),
            _id: { $ne: userId },
        });

        if (existingPhone) {
            const error = new Error("Phone already exists");
            error.statusCode = 409;
            throw error;
        }
    }

    if (file) {
        const result = await uploadImage(
            file.buffer,
            "medlink/profile-images"
        );

        user.profileImage = result.secure_url;
    }

    await user.save();

    return user;
};

export const changePassword = async (
    userId,
    currentPassword,
    newPassword
) => {
    const user = await User
        .findById(userId)
        .select("+passwordHash");

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    const isCurrentPasswordCorrect = await comparePassword(
        currentPassword,
        user.passwordHash
    );

    if (!isCurrentPasswordCorrect) {
        const error = new Error("Current password is incorrect");
        error.statusCode = 401;
        throw error;
    }

    const passwordHash = await hashPassword(newPassword);

    user.passwordHash = passwordHash;
    user.passwordChangedAt = new Date();

    await user.save();

    await revokeAllUserSessions(user._id);

    return true;
};

export const deleteCurrentUser = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    if (user.status === "DELETED") {
        const error = new Error("Account is already deleted");
        error.statusCode = 400;
        throw error;
    }

    user.status = "DELETED";
    user.deletedAt = new Date();

    await user.save();

    await revokeAllUserSessions(user._id);

    return true;
};

export const getUsers = async ({
    page = 1,
    limit = 10,
    role,
    status,
    search,
}) => {
    const filter = {};

    if (role) {
        filter.role = role;
    }

    if (status) {
        filter.status = status;
    }

    if (search) {
        filter.$or = [
            {
                firstName: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                lastName: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                email: {
                    $regex: search,
                    $options: "i",
                },
            },
        ];
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
        User.find(filter)
            .select("-passwordHash")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }),

        User.countDocuments(filter),
    ]);

    return {
        users,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};
export const getUserById = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    return user;
};
export const updateUserByAdmin = async (userId, data) => {
    const user = await User.findById(userId);

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    const allowedFields = [
        "role",
        "status",
        "isVerified",
        "isEmailVerified",
        "isPhoneVerified",
    ];

    allowedFields.forEach((field) => {
        if (data[field] !== undefined) {
            user[field] = data[field];
        }
    });

    await user.save();

    return user;
};
export const deleteUserByAdmin = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    if (user.status === "DELETED") {
        const error = new Error("Account is already deleted");
        error.statusCode = 400;
        throw error;
    }

    user.status = "DELETED";
    user.deletedAt = new Date();

    await user.save();

    await revokeAllUserSessions(user._id);

    return true;
};
export const restoreUserByAdmin = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    if (user.status !== "DELETED") {
        const error = new Error("User is not deleted");
        error.statusCode = 400;
        throw error;
    }

    user.status = "ACTIVE";
    user.deletedAt = null;

    await user.save();

    return user;
};