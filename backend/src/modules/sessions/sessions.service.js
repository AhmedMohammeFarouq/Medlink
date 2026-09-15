import Session from "./sessions.model.js";
import { hashToken } from "../../utils/hashToken.js";

export const createSession = async ({
    userId,
    refreshToken,
    expiresAt,
    deviceInfo,
    ipAddress,
    userAgent,
}) => {
    const tokenHash = hashToken(refreshToken);

    const session = await Session.create({
        user: userId,
        tokenHash,
        expiresAt,
        deviceInfo,
        ipAddress,
        userAgent,
    });

    return session;
};

export const findSessionByRefreshToken = async (refreshToken) => {
    const tokenHash = hashToken(refreshToken);

    const session = await Session.findOne({
        tokenHash,
    });

    return session;
};
export const revokeSession = async (sessionId) => {
    const session = await Session.findByIdAndUpdate(
        sessionId,
        {
            revokedAt: new Date(),
        },
        {
            new: true,
        }
    );

    return session;
};

export const revokeAllUserSessions = async (userId) => {
    return Session.updateMany(
        {
            user: userId,
            revokedAt: null,
        },
        {
            revokedAt: new Date(),
        }
    );
};


export const rotateSession = async ({
    sessionId,
    userId,
    refreshToken,
    newRefreshToken,
    expiresAt,
}) => {
    const session = await Session.findByIdAndUpdate(
        sessionId,
        {
            revokedAt: new Date(),
            lastUsedAt: new Date(),
        },
        {
            new: true,
        }
    );

    return createSession({
        userId,
        refreshToken: newRefreshToken,
        expiresAt,
        deviceInfo: session.deviceInfo,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
    });
};

export const getUserSessions = async (userId) => {
    const sessions = await Session.find({
        user: userId,
    }).select(
        "-tokenHash"
    );

    return sessions;
};

export const revokeUserSession = async (userId, sessionId) => {
    const session = await Session.findOne({
        _id: sessionId,
        user: userId,
    });

    if (!session) {
        const error = new Error("Session not found");
        error.statusCode = 404;
        throw error;
    }

    if (session.revokedAt) {
        const error = new Error("Session has already been revoked");
        error.statusCode = 400;
        throw error;
    }

    session.revokedAt = new Date();
    session.lastUsedAt = new Date();

    await session.save();

    return true;
};

export const validateSession = (session) => {
    if (!session) {
        const error = new Error("Session not found");
        error.statusCode = 401;
        throw error;
    }

    if (session.revokedAt) {
        const error = new Error("Session has been revoked");
        error.statusCode = 401;
        throw error;
    }

    if (session.expiresAt <= new Date()) {
        const error = new Error("Session has expired");
        error.statusCode = 401;
        throw error;
    }

    return true;
};

