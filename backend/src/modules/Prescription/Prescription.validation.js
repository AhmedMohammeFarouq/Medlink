export const createPrescriptionValidation = (req, res, next) => {
  const data = req.body || {};
  const errors = [];

  // patientName بدل patientId
 if (!data.patientPhone || typeof data.patientPhone !== "string" || !data.patientPhone.trim()) {
  errors.push("Patient phone number is required");
}

  // medications array
  if (!Array.isArray(data.medications) || data.medications.length === 0) {
    errors.push("At least one medication is required");
  } else {
    data.medications.forEach((med, index) => {
      if (!med.medicationName || typeof med.medicationName !== "string" || !med.medicationName.trim()) {
        errors.push(`Medication #${index + 1}: name is required`);
      }
      if (!med.dosage || typeof med.dosage !== "string" || !med.dosage.trim()) {
        errors.push(`Medication #${index + 1}: dosage is required`);
      }
      if (!med.frequency || typeof med.frequency !== "string" || !med.frequency.trim()) {
        errors.push(`Medication #${index + 1}: frequency is required`);
      }
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

export const prescriptionIdValidation = (req, res, next) => {
  const id = req.params.id || req.body.id;
  const errors = [];

  if (!id || typeof id !== "string" || !id.trim()) {
    errors.push("Prescription ID is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};