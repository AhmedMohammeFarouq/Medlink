import Medication from "./medication.model.js";

export class MedicationService {
  static async createMedication(data) {
    return await Medication.create(data);
  }

  static async getAllMedications(query = {}) {
    return await Medication.find(query).sort({ name: 1 });
  }

  static async getById(id) {
    return await Medication.findById(id);
  }

  static async updateStatus(id, status) {
    return await Medication.findByIdAndUpdate(id, { status }, { new: true });
  }

  static async deleteMedication(id) {
  const medication = await Medication.findById(id);

  if (!medication) {
    const error = new Error("Medication not found");
    error.statusCode = 404;
    throw error;
  }
  return await Medication.findByIdAndDelete(id);
};
}
