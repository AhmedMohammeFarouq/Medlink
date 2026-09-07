import * as authService from "./auth.service.js";
import { successResponse } from "../../utils/apiResponse.js";

export const register = async (req, res, next) => {
    try {
        const user = await authService.register(req.body);

        return successResponse({
            res,
            statusCode: 201,
            message: "User registered successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};
export const loginController = async (req, res, next) => {
    try {
        const result = await authService.login(req.body, {
            deviceInfo: req.headers["sec-ch-ua-platform"] || "Unknown",
            ipAddress: req.ip,
            userAgent: req.get("user-agent") || "Unknown",
        });
        return successResponse({
            res,
            statusCode: 200,
            message: "Login successful",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const refreshTokenController = async (req, res, next) => {
    try {
        const result = await authService.refreshAccessToken(
            req.body.refreshToken
        );

        return successResponse({
            res,
            statusCode: 200,
            message: "Token refreshed successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};
export const logoutController = async (req, res, next) => {
    try {
        await authService.logout(req.body.refreshToken);

        return successResponse({
            res,
            statusCode: 200,
            message: "Logout successful",
            data: null,
        });
    } catch (error) {
        next(error);
    }
};

export const forgotPasswordController = async (req, res, next) => {
    try {
        const result = await authService.forgotPassword(
            req.body.email
        );

        return successResponse({
            res,
            statusCode: 200,
            message: result.message,
            data: {
                resetToken: result.resetToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const resetPasswordController = async (req, res, next) => {
    try {
        await authService.resetPassword(
            req.body.resetToken,
            req.body.newPassword
        );

        return successResponse({
            res,
            statusCode: 200,
            message: "Password reset successfully",
            data: null,
        });
    } catch (error) {
        next(error);
    }
};
export const verifyEmailController = async (req, res, next) => {
    try {
        const result = await authService.verifyEmail(
            req.body.email,
            req.body.code
        );

        return successResponse({
            res,
            statusCode: 200,
            message: "Email verified successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const resendVerificationController = async (req, res, next) => {
    try {
        const result = await authService.resendVerification(
            req.body.email
        );

        return successResponse({
            res,
            statusCode: 200,
            message: "Verification code sent successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};