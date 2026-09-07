import Doctor from "../../models/Doctor.js";
import User from "../user/user.model.js";
import Appointment from "../appointments/appointment.model.js";
import MedicalRecord from "../medical-records/medicalRecord.model.js";
import { VERIFICATION_STATUS } from "./admin.types.js";
import { AuditService } from "../audit/services/audit.service.js";

export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

class AdminService {
  // ---- Doctor Verification ----
  async getPendingDoctors() {
    return Doctor.find({ "verification.status": VERIFICATION_STATUS.PENDING });
  }

  async getDoctorById(doctorId) {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) throw new ApiError(404, "Doctor not found");
    return doctor;
  }

  async approveDoctor(doctorId, adminId) {
    const doctor = await this.getDoctorById(doctorId);
    if (doctor.verification.status === VERIFICATION_STATUS.APPROVED) {
      throw new ApiError(409, "Doctor already approved");
    }
    doctor.verification.status = VERIFICATION_STATUS.APPROVED;
    doctor.verification.verifiedAt = new Date();
    doctor.verification.verifiedBy = adminId;
    doctor.verification.rejectionReason = null;
    await doctor.save();

    await AuditService.log({
      actorId: adminId,
      action: "ADMIN_APPROVED_DOCTOR",
      resourceType: "Doctor",
      resourceId: doctorId,
      metadata: { doctorId, adminId },
    });
    return doctor;
  }

  async rejectDoctor(doctorId, adminId, reason) {
    if (!reason || reason.trim() === "") {
      throw new ApiError(400, "Rejection reason is required");
    }
    const doctor = await this.getDoctorById(doctorId);
    if (doctor.verification.status === VERIFICATION_STATUS.REJECTED) {
      throw new ApiError(409, "Doctor already rejected");
    }
    doctor.verification.status = VERIFICATION_STATUS.REJECTED;
    doctor.verification.rejectionReason = reason;
    doctor.verification.verifiedBy = adminId;
    doctor.verification.verifiedAt = null;
    await doctor.save();

    await AuditService.log({
      actorId: adminId,
      action: "ADMIN_REJECTED_DOCTOR",
      resourceType: "Doctor",
      resourceId: doctorId,
      metadata: { doctorId, adminId, reason },
    });
    return doctor;
  }

  // ---- User Management ----
  async getUsers(filters = {}, pagination = {}) {
    const query = {};
    if (filters.status) query.status = filters.status;
    if (filters.role) query.role = filters.role;
    if (filters.search) {
      query.$or = [
        { firstName: { $regex: filters.search, $options: "i" } },
        { lastName: { $regex: filters.search, $options: "i" } },
        { email: { $regex: filters.search, $options: "i" } },
      ];
    }
    const { skip = 0, limit = 20 } = pagination;
    const [users, total] = await Promise.all([
      User.find(query).skip(skip).limit(limit).select("-passwordHash"),
      User.countDocuments(query),
    ]);
    return { data: users, total, page: Math.floor(skip / limit) + 1, limit };
  }

  async getUserById(userId) {
    const user = await User.findById(userId).select("-passwordHash");
    if (!user) throw new ApiError(404, "User not found");
    return user;
  }

  async updateUserStatus(userId, newStatus) {
    const allowed = ["ACTIVE", "INACTIVE", "SUSPENDED", "PENDING"];
    if (!allowed.includes(newStatus)) {
      throw new ApiError(400, "Invalid status");
    }
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");
    user.status = newStatus;
    await user.save();
    return user;
  }

  // ---- Basic Statistics ----
  async getBasicStatistics() {
    const [
      patientCount,
      doctorCount,
      totalAppointments,
      completedAppointments,
      activeUsers,
      medicalRecordUsage,
    ] = await Promise.all([
      User.countDocuments({ role: "PATIENT" }),
      Doctor.countDocuments(),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: "COMPLETED" }),
      User.countDocuments({ status: "ACTIVE" }),
      MedicalRecord.countDocuments(),
    ]);

    const bookingCompletionRate =
      totalAppointments > 0
        ? (completedAppointments / totalAppointments) * 100
        : 0;

    return {
      registeredPatients: patientCount,
      registeredDoctors: doctorCount,
      totalAppointments,
      completedAppointments,
      activeUsers,
      bookingCompletionRate,
      medicalRecordUsage,
    };
  }
}

export const adminService = new AdminService();
