import { registerUser } from './auth.service.js';

export const register = async (req, res, next) => {
    try {
        const result = await registerUser(req.body);

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};