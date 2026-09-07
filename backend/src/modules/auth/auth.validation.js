export const registerValidation = (data) => {
    const errors = [];

    // firstName
    if (
        typeof data.firstName !== "string" ||
        !data.firstName.trim()
    ) {
        errors.push("First name is required");
    } else {
        const firstName = data.firstName.trim();

        if (firstName.length < 2) {
            errors.push("First name must be at least 2 characters");
        }

        if (firstName.length > 50) {
            errors.push("First name must not exceed 50 characters");
        }
    }

    // lastName
    if (
        typeof data.lastName !== "string" ||
        !data.lastName.trim()
    ) {
        errors.push("Last name is required");
    } else {
        const lastName = data.lastName.trim();

        if (lastName.length < 2) {
            errors.push("Last name must be at least 2 characters");
        }

        if (lastName.length > 50) {
            errors.push("Last name must not exceed 50 characters");
        }
    }

    // email
    if (
        typeof data.email !== "string" ||
        !data.email.trim()
    ) {
        errors.push("Email is required");
    } else {
        const email = data.email.trim();

        if (email.length > 254) {
            errors.push("Email must not exceed 254 characters");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            errors.push("Please provide a valid email");
        }
    }

    // phone
    if (data.phone !== undefined && data.phone !== null) {
        if (typeof data.phone !== "string") {
            errors.push("Phone must be a string");
        } else if (data.phone.trim()) {
            const phone = data.phone.trim();

            const egyptianPhoneRegex = /^01[0125][0-9]{8}$/;

            if (!egyptianPhoneRegex.test(phone)) {
                errors.push(
                    "Phone must be a valid Egyptian mobile number"
                );
            }
        }
    }

    // password
    if (
        typeof data.password !== "string" ||
        !data.password
    ) {
        errors.push("Password is required");
    } else if (data.password.length < 8) {
        errors.push("Password must be at least 8 characters");
    }

    // gender
    if (data.gender !== undefined && data.gender !== null) {
        if (
            !["MALE", "FEMALE", "OTHER"].includes(data.gender)
        ) {
            errors.push(
                "Gender must be MALE, FEMALE, or OTHER"
            );
        }
    }

    // dateOfBirth
    if (
        data.dateOfBirth !== undefined &&
        data.dateOfBirth !== null
    ) {
        const dateOfBirth = new Date(data.dateOfBirth);

        if (isNaN(dateOfBirth.getTime())) {
            errors.push("Date of birth must be a valid date");
        } else if (dateOfBirth > new Date()) {
            errors.push(
                "Date of birth cannot be in the future"
            );
        }
    }

    return errors;
};

export const loginValidation = (data) => {
    const errors = [];

    if (
        typeof data.email !== "string" ||
        !data.email.trim()
    ) {
        errors.push("Email is required");
    } else {
        const email = data.email.trim();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            errors.push("Please provide a valid email");
        }
    }

    if (
        typeof data.password !== "string" ||
        !data.password
    ) {
        errors.push("Password is required");
    }

    return errors;
};

export const refreshTokenValidation = (data) => {
    const errors = [];

    if (
        typeof data.refreshToken !== "string" ||
        !data.refreshToken.trim()
    ) {
        errors.push("Refresh token is required");
    }

    return errors;
};
export const logoutValidation = (data) => {
    const errors = [];

    if (
        typeof data.refreshToken !== "string" ||
        !data.refreshToken.trim()
    ) {
        errors.push("Refresh token is required");
    }

    return errors;
};

export const forgotPasswordValidation = (data) => {
    const errors = [];

    if (
        typeof data.email !== "string" ||
        !data.email.trim()
    ) {
        errors.push("Email is required");
    } else {
        const email = data.email.trim();

        if (email.length > 254) {
            errors.push("Email must not exceed 254 characters");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            errors.push("Please provide a valid email");
        }
    }

    return errors;
};

export const resetPasswordValidation = (data) => {
    const errors = [];

    if (
        typeof data.resetToken !== "string" ||
        !data.resetToken.trim()
    ) {
        errors.push("Reset token is required");
    }

    if (
        typeof data.newPassword !== "string" ||
        !data.newPassword
    ) {
        errors.push("New password is required");
    } else if (data.newPassword.length < 8) {
        errors.push("New password must be at least 8 characters");
    }

    return errors;
};
export const verifyEmailValidation = (data) => {
    const errors = [];

    if (
        typeof data.email !== "string" ||
        !data.email.trim()
    ) {
        errors.push("Email is required");
    } else {
        const email = data.email.trim();

        if (email.length > 254) {
            errors.push("Email must not exceed 254 characters");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            errors.push("Please provide a valid email");
        }
    }

    if (
        typeof data.code !== "string" ||
        !data.code.trim()
    ) {
        errors.push("Verification code is required");
    } else if (!/^\d{6}$/.test(data.code.trim())) {
        errors.push("Verification code must be exactly 6 digits");
    }

    return errors;
};