import User from "../users/user.model.js";
import { hashPassword, comparePassword } from "../../utils/hashPassword.js";
import {
    createSession,
    findSessionByRefreshToken,
    validateSession,
    rotateSession,
    revokeSession,
    revokeAllUserSessions,
} from "../sessions/sessions.service.js";
import { getExpirationDate } from "../../utils/date.utils.js";
import env from "../../config/env.js";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
} from "../../utils/token.utils.js";

import { generateResetToken } from "../../utils/generateResetToken.js";
import { hashToken } from "../../utils/hashToken.js";
import { generateVerificationCode } from "../../utils/generateVerificationCode.js";


export const register = async (data) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dateOfBirth,
    } = data;

    // 1. Check if email already exists
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
        const error = new Error("Email already exists");
        error.statusCode = 409;
        throw error;
    }

    // 2. Check if phone already exists
    if (phone) {
        const existingPhone = await User.findOne({ phone });

        if (existingPhone) {
            const error = new Error("Phone already exists");
            error.statusCode = 409;
            throw error;
        }
    }

    // 3. Hash password
    const passwordHash = await hashPassword(password);

    // 4. Create user
    const user = await User.create({
        firstName,
        lastName,
        email,
        phone,
        passwordHash,
        role: "PATIENT",
        status: "PENDING",
        gender,
        dateOfBirth,
    });
    // 4. Generate access and refresh tokens and verification code
    const verificationCode = await generateEmailVerificationCode(user._id);
    // 5. Generate access and refresh tokens
    const tokenPayload = {
        userId: user._id,
        role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);

    const refreshToken = generateRefreshToken(tokenPayload);
    // 6. Create session
    await createSession({
        userId: user._id,
        refreshToken,
        expiresAt: getExpirationDate(env.jwt.refreshExpiresIn),
    });
    // 7. Remove sensitive data
    const userResponse = user.toObject();
    delete userResponse.passwordHash;

    // 8. Return user and tokens
    return {
        user: userResponse,
        tokens: {
            accessToken,
            refreshToken,
        },
        verificationCode,
    };
};

export const login = async (data) => {
    const { email, password } = data;

    const user = await User
        .findOne({ email: email.toLowerCase().trim() })
        .select("+passwordHash");

    if (!user) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const isPasswordCorrect = await comparePassword(
        password,
        user.passwordHash
    );

    if (!isPasswordCorrect) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    if (user.status === "DELETED") {
        const error = new Error("Account has been deleted");
        error.statusCode = 403;
        throw error;
    }

    if (user.status === "SUSPENDED") {
        const error = new Error("Account is suspended");
        error.statusCode = 403;
        throw error;
    }

    const tokenPayload = {
        userId: user._id,
        role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);

    const refreshToken = generateRefreshToken(tokenPayload);
    // Create session
    await createSession({
        userId: user._id,
        refreshToken,
        expiresAt: getExpirationDate(env.jwt.refreshExpiresIn),
    });
    await User.findByIdAndUpdate(
        user._id,
        {
            lastLoginAt: new Date(),
        }
    );
    const userResponse = user.toObject();

    delete userResponse.passwordHash;

    return {
        user: userResponse,
        tokens: {
            accessToken,
            refreshToken,
        },
    };
};
export const refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) {
        const error = new Error("Refresh token is required");
        error.statusCode = 401;
        throw error;
    }

    let decoded;

    try {
        decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
        const authError = new Error("Invalid or expired refresh token");
        authError.statusCode = 401;
        throw authError;
    }


    const session = await findSessionByRefreshToken(refreshToken);
    validateSession(session);


    const user = await User.findById(decoded.userId);

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    if (user.status === "DELETED") {
        const error = new Error("Account has been deleted");
        error.statusCode = 403;
        throw error;
    }

    if (user.status === "SUSPENDED") {
        const error = new Error("Account is suspended");
        error.statusCode = 403;
        throw error;
    }

    const tokenPayload = {
        userId: user._id,
        role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);
    await rotateSession({
        sessionId: session._id,
        userId: user._id,
        refreshToken,
        newRefreshToken,
        expiresAt: getExpirationDate(env.jwt.refreshExpiresIn),
    });
    return {
        accessToken,
        refreshToken: newRefreshToken,
    };
};
export const logout = async (refreshToken) => {
    if (!refreshToken) {
        const error = new Error("Refresh token is required");
        error.statusCode = 401;
        throw error;
    }

    const session = await findSessionByRefreshToken(refreshToken);

    validateSession(session);

    await revokeSession(session._id);

    return true;
};



export const forgotPassword = async (email) => {
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
        email: normalizedEmail,
    });

    // Do not reveal whether the email exists
    if (!user) {
        return {
            message: "If the email exists, a password reset link will be sent",
        };
    }

    const resetToken = generateResetToken();
    const resetTokenHash = hashToken(resetToken);

    const resetTokenExpiresAt = getExpirationDate("15m");

    await User.findByIdAndUpdate(user._id, {
        passwordResetTokenHash: resetTokenHash,
        passwordResetExpiresAt: resetTokenExpiresAt,
    });

    return {
        message: "If the email exists, a password reset link will be sent",
        resetToken,
    };
};

export const resetPassword = async (resetToken, newPassword) => {
    const tokenHash = hashToken(resetToken);

    const user = await User
        .findOne({
            passwordResetTokenHash: tokenHash,
        })
        .select("+passwordResetTokenHash +passwordResetExpiresAt");

    if (!user) {
        const error = new Error("Invalid or expired reset token");
        error.statusCode = 400;
        throw error;
    }

    if (
        !user.passwordResetExpiresAt ||
        user.passwordResetExpiresAt <= new Date()
    ) {
        const error = new Error("Invalid or expired reset token");
        error.statusCode = 400;
        throw error;
    }

    const passwordHash = await hashPassword(newPassword);

    await User.findByIdAndUpdate(user._id, {
        passwordHash,
        passwordChangedAt: new Date(),
        passwordResetTokenHash: null,
        passwordResetExpiresAt: null,
    });

    await revokeAllUserSessions(user._id);

    return true;
};
export const generateEmailVerificationCode = async (userId) => {
    const code = generateVerificationCode();
    const codeHash = hashToken(code);
    const codeExpiresAt = getExpirationDate("10m");

    await User.findByIdAndUpdate(userId, {
        emailVerificationCodeHash: codeHash,
        emailVerificationCodeExpiresAt: codeExpiresAt,
    });

    return code;
};

export const verifyEmail = async (email, code) => {
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User
        .findOne({ email: normalizedEmail })
        .select(
            "+emailVerificationCodeHash +emailVerificationCodeExpiresAt"
        );

    if (!user) {
        const error = new Error("Invalid or expired verification code");
        error.statusCode = 400;
        throw error;
    }

    if (user.isEmailVerified) {
        const error = new Error("Email is already verified");
        error.statusCode = 400;
        throw error;
    }

    if (
        !user.emailVerificationCodeHash ||
        !user.emailVerificationCodeExpiresAt ||
        user.emailVerificationCodeExpiresAt <= new Date()
    ) {
        const error = new Error("Invalid or expired verification code");
        error.statusCode = 400;
        throw error;
    }

    const codeHash = hashToken(code);

    if (codeHash !== user.emailVerificationCodeHash) {
        const error = new Error("Invalid or expired verification code");
        error.statusCode = 400;
        throw error;
    }

    await User.findByIdAndUpdate(user._id, {
        isEmailVerified: true,
        isVerified: true,
        status: "ACTIVE",
        emailVerificationCodeHash: null,
        emailVerificationCodeExpiresAt: null,
    });

    return true;
};