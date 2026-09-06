import User from './user.model.js';

export const createUser = async (userData) => {
    const user = await User.create(userData);

    return user;
};

export const findUserByEmail = async (email) => {
    return User.findOne({ email: email.toLowerCase() });
};

export const findUserById = async (userId) => {
    return User.findById(userId);
};

export const updateUser = async (userId, updateData) => {
    return User.findByIdAndUpdate(
        userId,
        updateData,
        {
            new: true,
            runValidators: true,
        }
    );
};