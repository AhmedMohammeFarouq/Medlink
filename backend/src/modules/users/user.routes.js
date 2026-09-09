import { Router } from "express";

import authMiddleware from "../../middlewares/auth.middleware.js";
import validationMiddleware from "../../middlewares/validation.middleware.js";
import { uploadProfileImage } from "../../middlewares/upload.middleware.js";
import permissionMiddleware from "../../middlewares/permission.middleware.js";

import { PERMISSIONS } from "../../constants/permissions.js";

import * as userController from "./user.controller.js";
import * as userValidation from "./user.validation.js";

const router = Router();

/*Current User*/

// Get current user
router.get(
    "/me",
    authMiddleware,
    userController.getCurrentUser
);

// Update current user profile
router.patch(
    "/me",
    authMiddleware,
    uploadProfileImage,
    validationMiddleware(userValidation.updateProfileValidation),
    userController.updateProfile
);

// Change current user password
router.patch(
    "/me/password",
    authMiddleware,
    validationMiddleware(userValidation.changePasswordValidation),
    userController.changePassword
);

// Delete current user account
router.delete(
    "/me",
    authMiddleware,
    userController.deleteCurrentUser
);

/*
Current User Sessions / Device Management
*/

// Get all sessions/devices of current user
router.get(
    "/me/sessions",
    authMiddleware,
    userController.getCurrentUserSessions
);

// Revoke one session/device
router.delete(
    "/me/sessions/:sessionId",
    authMiddleware,
    userController.revokeCurrentUserSession
);

// Revoke all sessions/devices
router.delete(
    "/me/sessions",
    authMiddleware,
    userController.revokeAllCurrentUserSessions
);

/*
Admin User Management
*/

// Get all users
router.get(
    "/",
    authMiddleware,
    permissionMiddleware(PERMISSIONS.USER_READ),
    validationMiddleware(userValidation.getUsersValidation),
    userController.getUsers
);

// Get user by ID
router.get(
    "/:userId",
    authMiddleware,
    permissionMiddleware(PERMISSIONS.USER_READ),
    validationMiddleware(userValidation.getUserByIdValidation),
    userController.getUserById
);

// Update user by ID
router.patch(
    "/:userId",
    authMiddleware,
    permissionMiddleware(PERMISSIONS.USER_UPDATE),
    validationMiddleware(userValidation.updateUserByAdminValidation),
    userController.updateUserByAdmin
);

// Delete user by ID
router.delete(
    "/:userId",
    authMiddleware,
    permissionMiddleware(PERMISSIONS.USER_DELETE),
    validationMiddleware(userValidation.getUserByIdValidation),
    userController.deleteUserByAdmin
);

// Restore deleted user
router.patch(
    "/:userId/restore",
    authMiddleware,
    permissionMiddleware(PERMISSIONS.USER_UPDATE),
    validationMiddleware(userValidation.getUserByIdValidation),
    userController.restoreUserByAdmin
);

export default router;