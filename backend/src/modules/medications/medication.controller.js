import { MedicationService } from "./medication.service.js";

export class MedicationController {
  static async create(req, res, next) {
    try {
      const medication = await MedicationService.createMedication(req.body);
      res.status(201).json({ success: true, data: medication });
    } catch (err) {
      next(err);
    }
  }

  static async getAll(req, res, next) {
    try {
      const medications = await MedicationService.getAllMedications(req.query);
      res.status(200).json({ success: true, data: medications });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const medication = await MedicationService.getById(req.params.id);
      res.status(200).json({ success: true, data: medication });
    } catch (err) {
      next(err);
    }
  }

  static async updateStatus(req, res, next) {
    try {
      const updated = await MedicationService.updateStatus(
        req.params.id,
        req.body.status,
      );
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async deleteMedication  (req, res, next) {
  try {
    const result = await MedicationService.deleteMedication(req.params.id);

    return res.
      status(200).json({success: true,
      message: "Medication deleted successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
}
