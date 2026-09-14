import { auditService } from "./audit.services.js";
import { successResponse } from "../../utils/apiResponse.js";

export const auditController = {
  async getLogs(req, res, next) {
    try {
      const {
        actorId,
        action,
        resourceType,
        resourceId,
        startDate,
        endDate,
        page = 1,
        limit = 50,
      } = req.query;
      const skip = (page - 1) * limit;
      const filters = {
        actorId,
        action,
        resourceType,
        resourceId,
        startDate,
        endDate,
      };
      Object.keys(filters).forEach(
        (key) => filters[key] === undefined && delete filters[key],
      );
      const result = await auditService.getLogs(filters, {
        skip,
        limit: parseInt(limit),
      });
      return successResponse({
        res,
        statusCode: 200,
        message: "Audit logs retrieved",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async getLogById(req, res, next) {
    try {
      const log = await auditService.getLogById(req.params.auditId);
      return successResponse({
        res,
        statusCode: 200,
        message: "Audit log retrieved",
        data: log,
      });
    } catch (error) {
      next(error);
    }
  },
};
