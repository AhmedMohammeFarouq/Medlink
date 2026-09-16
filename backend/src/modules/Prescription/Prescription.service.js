import Prescription from "./Prescription.model.js";

export class PrescriptionService {
  static async createPrescription(data) {
    return await Prescription.create(data);
  }

  static async getAllPrescriptions(query = {}) {
    return await Prescription.find(query).sort({ name: 1 });
  }

  static async getById(id) {
    return await Prescription.findById(id);
  }

  static async updateStatus(id, status) {
    return await Prescription.findByIdAndUpdate(id, { status }, { new: true });
  }

  static async updatePrescription(id, data) {
  return await Prescription.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

  static async deletePrescription(id) {
    return await Prescription.findByIdAndDelete(id);
  }
}