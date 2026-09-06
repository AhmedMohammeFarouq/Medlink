import User from '../users/user.model.js';
import {findUserByEmail,createUser} from '../users/user.service.js';
import { hashPassword } from '../../utils/hashPassword.js';

export const registerUser = async (userData) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
    } = userData;

    // 1. Check if email already exists
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
        const error = new Error('Email is already registered');
        error.statusCode = 409;
        throw error;
    }

    // 2. Check if phone already exists
    if (phone) {
        const existingPhone = await User.findOne({ phone });

        if (existingPhone) {
            const error = new Error('Phone number is already registered');
            error.statusCode = 409;
            throw error;
        }
    }

    // 3. Hash password
    const passwordHash = await hashPassword(password);

    // 4. Create user
    const user = await createUser({
        firstName,
        lastName,
        email,
        phone,
        passwordHash,
        gender,

        // Registration defaults
        role: 'PATIENT',
        status: 'PENDING',
        isVerified: false,
        isEmailVerified: false,
        isPhoneVerified: false,
    });

    // 5. Remove sensitive data from response
    const userObject = user.toObject();

    delete userObject.passwordHash;

    return userObject;
};