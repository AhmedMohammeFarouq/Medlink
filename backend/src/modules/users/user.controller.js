import * as userService from "./user.service.js";
import { successResponse } from "../../utils/apiResponse.js";
import { getUserSessions, revokeUserSession, revokeAllUserSessions } from "../sessions/sessions.service.js";
export const getCurrentUser = async (req, res, next) => {
    try {
        const user = await userService.getCurrentUser(req.user.userId);

        return successResponse({
            res,
            statusCode: 200,
            message: "User retrieved successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const user = await userService.updateProfile(
            req.user.userId,
            req.body,
            req.file
        );

        return successResponse({
            res,
            statusCode: 200,
            message: "Profile updated successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const changePassword = async (req, res, next) => {
    try {
        await userService.changePassword(
            req.user.userId,
            req.body.currentPassword,
            req.body.newPassword
        );

        return successResponse({
            res,
            statusCode: 200,
            message: "Password changed successfully",
            data: null,
        });
    } catch (error) {
        next(error);
    }
};
export const deleteCurrentUser = async (req, res, next) => {
    try {
        await userService.deleteCurrentUser(req.user.userId);

        return successResponse({
            res,
            statusCode: 200,
            message: "Account deleted successfully",
            data: null,
        });
    } catch (error) {
        next(error);
    }
};

export const getCurrentUserSessions = async (req, res, next) => {
    try {
        const sessions = await getUserSessions(req.user.userId);

        return successResponse({
            res,
            statusCode: 200,
            message: "Sessions retrieved successfully",
            data: sessions,
        });
    } catch (error) {
        next(error);
    }
};

export const revokeCurrentUserSession = async (req, res, next) => {
    try {
        await revokeUserSession(
            req.user.userId,
            req.params.sessionId
        );

        return successResponse({
            res,
            statusCode: 200,
            message: "Session revoked successfully",
            data: null,
        });
    } catch (error) {
        next(error);
    }
};

export const revokeAllCurrentUserSessions = async (req, res, next) => {
    try {
        await revokeAllUserSessions(req.user.userId);

        return successResponse({
            res,
            statusCode: 200,
            message: "All sessions revoked successfully",
            data: null,
        });
    } catch (error) {
        next(error);
    }
};

export const getUsers = async (req, res, next) => {
    try {
        const result = await userService.getUsers({
            page: req.query.page,
            limit: req.query.limit,
            role: req.query.role,
            status: req.query.status,
            search: req.query.search,
        });

        return successResponse({
            res,
            statusCode: 200,
            message: "Users retrieved successfully",
            data: result.users,
            meta: result.pagination,
        });
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.userId);

        return successResponse({
            res,
            statusCode: 200,
            message: "User retrieved successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const updateUserByAdmin = async (req, res, next) => {
    try {
        const user = await userService.updateUserByAdmin(
            req.params.userId,
            req.body
        );

        return successResponse({
            res,
            statusCode: 200,
            message: "User updated successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteUserByAdmin = async (req, res, next) => {
    try {
        await userService.deleteUserByAdmin(req.params.userId);

        return successResponse({
            res,
            statusCode: 200,
            message: "User deleted successfully",
            data: null,
        });
    } catch (error) {
        next(error);
    }
};
export const restoreUserByAdmin = async (req, res, next) => {
    try {
        const user = await userService.restoreUserByAdmin(
            req.params.userId
        );

        return successResponse({
            res,
            statusCode: 200,
            message: "User restored successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};