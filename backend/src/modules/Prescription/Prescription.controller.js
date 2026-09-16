import { PrescriptionService } from "./Prescription.service.js";
import Patient from "../patients/patient.model.js";
import User from "../users/user.model.js";
// async function generateUniqueMrn() {
// const year = new Date().getFullYear();
// let unique = false;
// let generatedMrn;

// while (!unique) {
//   const random = Math.random().toString(36).substring(2, 8).toUpperCase();
//   generatedMrn = `MV-${year}-${random}`;
//   const existing = await Patient.findOne({ mrn: generatedMrn });
//   if (!existing) unique = true;
// }

// return generatedMrn;
// }
export class PrescriptionController {

  static async lookupPatient(req, res, next) {
  try {
    const { phone } = req.query;

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const matchedUser = await User.findOne({
      phone: phone.trim(),
      role: "PATIENT",
    });

    if (!matchedUser) {
      return res.status(404).json({
        success: false,
        message: "No patient found with this phone number",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        patientName: `${matchedUser.firstName} ${matchedUser.lastName}`,
      },
    });
  } catch (err) {
    next(err);
  }
}

  static async create(req, res, next) {
    try {
      const { patientPhone, ...rest } = req.body;

      if (!patientPhone || !patientPhone.trim()) {
        return res.status(400).json({
          success: false,
          message: "Patient phone number is required",
        });
      }

      const matchedUser = await User.findOne({
  phone: patientPhone.trim(),
  role: "PATIENT",
});

if (!matchedUser) {
  return res.status(404).json({
    success: false,
    message: "No patient found with this phone number",
  });
}

const prescriptionData = {
  ...rest,
  patientId: matchedUser._id,
  patientName: `${matchedUser.firstName} ${matchedUser.lastName}`,
  doctorId: req.user.userId,
};

      const prescription = await PrescriptionService.createPrescription(prescriptionData);
      res.status(201).json({ success: true, data: prescription });
    } catch (err) {
      next(err);
    }
  }
  
  
  static async getAll(req, res, next) {
    try {
      const prescriptions = await PrescriptionService.getAllPrescriptions(req.query);
      res.status(200).json({ success: true, data: prescriptions });
    } catch (err) {
      next(err);
    }
  }


  static async getById(req, res, next) {
    try {
      const prescription = await PrescriptionService.getById(req.params.id);
      res.status(200).json({ success: true, data: prescription });
    } catch (err) {
      next(err);
    }
  }

  static async updateStatus(req, res, next) {
    try {
      const updated = await PrescriptionService.updateStatus(
        req.params.id,
        req.body.status
      );
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
  try {
    const updated = await PrescriptionService.updatePrescription(req.params.id, req.body);

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

  static async deletePrescription(req, res, next) {
    try {
      const result = await PrescriptionService.deletePrescription(req.params.id);
      return res.status(200).json({
        success: true,
        message: "Prescription deleted successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}