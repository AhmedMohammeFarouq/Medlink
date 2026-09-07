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
        const result = await authService.login(req.body);

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