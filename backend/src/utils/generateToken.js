import jwt from "jsonwebtoken";

import env from "../config/env.js";

export const generateAccessToken = (payload) => {
    return jwt.sign(
        {
            ...payload,
            type: "access",
        },
        env.jwt.secret,
        {
            expiresIn: "15m",
        }
    );
};

export const generateRefreshToken = (payload) => {
    return jwt.sign(
        {
            ...payload,
            type: "refresh",
        },
        env.jwt.secret,
        {
            expiresIn: env.jwt.expiresIn,
        }
    );
};

export const verifyToken = (token) => {
    return jwt.verify(token, env.jwt.secret);
};