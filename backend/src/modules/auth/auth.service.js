import User from "../users/user.model.js";
import { hashPassword, comparePassword } from "../../utils/hashPassword.js";
import {
    createSession,
    findSessionByRefreshToken,
    validateSession,
    rotateSession,
    revokeSession,
} from "../sessions/sessions.service.js";
import { getExpirationDate } from "../../utils/date.utils.js";
import env from "../../config/env.js";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
} from "../../utils/token.utils.js";

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
    // 4. Generate access and refresh tokens
    const tokenPayload = {
        userId: user._id,
        role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);

    const refreshToken = generateRefreshToken(tokenPayload);
    // 5. Create session
    await createSession({
        userId: user._id,
        refreshToken,
        expiresAt: getExpirationDate(env.jwt.refreshExpiresIn),
    });
    // 6. Remove sensitive data
    const userResponse = user.toObject();
    delete userResponse.passwordHash;

    // 6. Return user and tokens
    return {
        user: userResponse,
        tokens: {
            accessToken,
            refreshToken,
        },
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