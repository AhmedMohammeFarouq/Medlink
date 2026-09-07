import Session from "./sessions.model.js";
import { hashToken } from "../../utils/hashToken.js";

export const createSession = async ({
    userId,
    refreshToken,
    expiresAt,
}) => {
    const tokenHash = hashToken(refreshToken);

    const session = await Session.create({
        user: userId,
        tokenHash,
        expiresAt,
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

export const rotateSession = async ({
    sessionId,
    userId,
    refreshToken,
    newRefreshToken,
    expiresAt,
}) => {
    await Session.findByIdAndUpdate(sessionId, {
        revokedAt: new Date(),
        lastUsedAt: new Date(),
    });

    return createSession({
        userId,
        refreshToken: newRefreshToken,
        expiresAt,
    });
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