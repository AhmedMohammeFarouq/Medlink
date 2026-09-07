import mongoose from "mongoose";
export const updateProfileValidation = (data, file) => {
    const errors = [];

    const allowedFields = [
        "firstName",
        "lastName",
        "phone",
        "gender",
        "dateOfBirth",
    ];

    const receivedFields = Object.keys(data);

    const unexpectedFields = receivedFields.filter(
        (field) => !allowedFields.includes(field)
    );

    if (unexpectedFields.length > 0) {
        errors.push(
            `Fields not allowed: ${unexpectedFields.join(", ")}`
        );
    }

    if (receivedFields.length === 0 && !file) {
        errors.push("At least one field is required");
    }

    if (data.firstName !== undefined) {
        if (
            typeof data.firstName !== "string" ||
            !data.firstName.trim()
        ) {
            errors.push("First name must be a non-empty string");
        } else if (data.firstName.trim().length < 2) {
            errors.push("First name must be at least 2 characters");
        } else if (data.firstName.trim().length > 50) {
            errors.push("First name must not exceed 50 characters");
        }
    }

    if (data.lastName !== undefined) {
        if (
            typeof data.lastName !== "string" ||
            !data.lastName.trim()
        ) {
            errors.push("Last name must be a non-empty string");
        } else if (data.lastName.trim().length < 2) {
            errors.push("Last name must be at least 2 characters");
        } else if (data.lastName.trim().length > 50) {
            errors.push("Last name must not exceed 50 characters");
        }
    }

    if (data.phone !== undefined) {
        if (
            typeof data.phone !== "string" ||
            !data.phone.trim()
        ) {
            errors.push("Phone must be a non-empty string");
        } else if (!/^01[0125][0-9]{8}$/.test(data.phone.trim())) {
            errors.push("Phone must be a valid Egyptian mobile number");
        }
    }

    if (data.gender !== undefined) {
        if (!["MALE", "FEMALE", "OTHER"].includes(data.gender)) {
            errors.push("Invalid gender");
        }
    }

    if (data.dateOfBirth !== undefined) {
        const date = new Date(data.dateOfBirth);

        if (Number.isNaN(date.getTime())) {
            errors.push("Invalid date of birth");
        } else if (date > new Date()) {
            errors.push("Date of birth cannot be in the future");
        }
    }

    return errors;
};

export const changePasswordValidation = (data) => {
    const errors = [];

    const allowedFields = [
        "currentPassword",
        "newPassword",
    ];

    const receivedFields = Object.keys(data);

    const unexpectedFields = receivedFields.filter(
        (field) => !allowedFields.includes(field)
    );

    if (unexpectedFields.length > 0) {
        errors.push(
            `Fields not allowed: ${unexpectedFields.join(", ")}`
        );
    }

    if (
        typeof data.currentPassword !== "string" ||
        !data.currentPassword
    ) {
        errors.push("Current password is required");
    }

    if (
        typeof data.newPassword !== "string" ||
        !data.newPassword
    ) {
        errors.push("New password is required");
    } else if (data.newPassword.length < 8) {
        errors.push("New password must be at least 8 characters");
    }

    if (
        typeof data.currentPassword === "string" &&
        typeof data.newPassword === "string" &&
        data.currentPassword &&
        data.newPassword &&
        data.currentPassword === data.newPassword
    ) {
        errors.push(
            "New password must be different from current password"
        );
    }

    if (receivedFields.length === 0) {
        errors.push("Current password and new password are required");
    }

    return errors;
};
export const getUsersValidation = (data) => {
    const errors = [];

    const allowedFields = [
        "page",
        "limit",
        "role",
        "status",
        "search",
    ];

    const receivedFields = Object.keys(data);

    const unexpectedFields = receivedFields.filter(
        (field) => !allowedFields.includes(field)
    );

    if (unexpectedFields.length > 0) {
        errors.push(
            `Fields not allowed: ${unexpectedFields.join(", ")}`
        );
    }

    if (data.page !== undefined) {
        const page = Number(data.page);

        if (!Number.isInteger(page) || page < 1) {
            errors.push("Page must be a positive integer");
        }
    }

    if (data.limit !== undefined) {
        const limit = Number(data.limit);

        if (!Number.isInteger(limit) || limit < 1) {
            errors.push("Limit must be a positive integer");
        } else if (limit > 100) {
            errors.push("Limit must not exceed 100");
        }
    }

    const allowedRoles = [
        "PATIENT",
        "DOCTOR",
        "RECEPTIONIST",
        "CLINIC_ADMIN",
        "SYSTEM_ADMIN",
    ];

    if (data.role !== undefined) {
        if (!allowedRoles.includes(data.role)) {
            errors.push("Invalid user role");
        }
    }

    const allowedStatuses = [
        "ACTIVE",
        "INACTIVE",
        "SUSPENDED",
        "PENDING",
        "DELETED",
    ];

    if (data.status !== undefined) {
        if (!allowedStatuses.includes(data.status)) {
            errors.push("Invalid user status");
        }
    }

    if (data.search !== undefined) {
        if (typeof data.search !== "string") {
            errors.push("Search must be a string");
        } else if (data.search.trim().length > 100) {
            errors.push("Search must not exceed 100 characters");
        }
    }

    return errors;
};

export const getUserByIdValidation = (data, file, params) => {
    const errors = [];

    if (!params.userId) {
        errors.push("User ID is required");
        return errors;
    }

    if (!mongoose.Types.ObjectId.isValid(params.userId)) {
        errors.push("Invalid user ID");
    }

    return errors;
};

export const updateUserByAdminValidation = (data) => {
    const errors = [];

    const allowedFields = [
        "role",
        "status",
        "isVerified",
        "isEmailVerified",
        "isPhoneVerified",
    ];

    const receivedFields = Object.keys(data);

    const unexpectedFields = receivedFields.filter(
        (field) => !allowedFields.includes(field)
    );

    if (unexpectedFields.length > 0) {
        errors.push(
            `Fields not allowed: ${unexpectedFields.join(", ")}`
        );
    }

    if (receivedFields.length === 0) {
        errors.push("At least one field is required");
    }

    const allowedRoles = [
        "PATIENT",
        "DOCTOR",
        "RECEPTIONIST",
        "CLINIC_ADMIN",
        "SYSTEM_ADMIN",
    ];

    if (data.role !== undefined) {
        if (!allowedRoles.includes(data.role)) {
            errors.push("Invalid user role");
        }
    }

    const allowedStatuses = [
        "ACTIVE",
        "INACTIVE",
        "SUSPENDED",
        "PENDING",
        "DELETED",
    ];

    if (data.status !== undefined) {
        if (!allowedStatuses.includes(data.status)) {
            errors.push("Invalid user status");
        }
    }

    const booleanFields = [
        "isVerified",
        "isEmailVerified",
        "isPhoneVerified",
    ];

    booleanFields.forEach((field) => {
        if (data[field] !== undefined && typeof data[field] !== "boolean") {
            errors.push(`${field} must be a boolean`);
        }
    });

    return errors;
};