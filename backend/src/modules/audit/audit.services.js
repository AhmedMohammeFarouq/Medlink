import AuditLog from "./audit.model.js";
import { ApiError } from "../admin/admin.service.js";

class AuditService {
  async log(entry) {
    try {
      const log = new AuditLog(entry);
      await log.save();
    } catch (error) {
      console.error("Audit log failed:", error);
    }
  }

  async getLogs(filters = {}, pagination = {}) {
    const { actorId, action, resourceType, resourceId, startDate, endDate } =
      filters;
    const query = {};
    if (actorId) query.actorId = actorId;
    if (action) query.action = action;
    if (resourceType) query.resourceType = resourceType;
    if (resourceId) query.resourceId = resourceId;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    const { skip = 0, limit = 50 } = pagination;
    const [logs, total] = await Promise.all([
      AuditLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      AuditLog.countDocuments(query),
    ]);
    return { data: logs, total, page: Math.floor(skip / limit) + 1, limit };
  }

  async getLogById(logId) {
    const log = await AuditLog.findById(logId);
    if (!log) throw new ApiError(404, "Audit log not found");
    return log;
  }
}

export const auditService = new AuditService();
export { AuditService };
