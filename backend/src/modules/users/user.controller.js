import { successResponse } from "../../utils/apiResponse.js";
import { getMyProfile } from "./user.service.js";

export const getMyProfileController = async (req, res, next) => {
    try {
        const user = await getMyProfile(req.user.userId);

        const userResponse = user.toObject();

        delete userResponse.passwordHash;

        return successResponse({
            res,
            statusCode: 200,
            message: "Profile retrieved successfully",
            data: userResponse,
        });
    } catch (error) {
        next(error);
    }
};