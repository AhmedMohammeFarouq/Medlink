const VALID_TYPES = [
  "MEDICAL_RECORD_ACCESS",
  "DOCUMENT_ACCESS",
  "PRESCRIPTION_ACCESS",
  "CHAT_ACCESS",
  "FULL_ACCESS",
  "OTHER",
];

const VALID_SCOPES = [
  "MEDICAL_RECORDS",
  "DOCUMENTS",
  "PRESCRIPTIONS",
  "APPOINTMENTS",
  "ENCOUNTERS",
  "PROFILE",
  "CHAT",
];

export const createConsentValidation = (req, res, next) => {
  const data = req.body || {};
  const errors = [];

  if (!data.patientId || typeof data.patientId !== "string" || !data.patientId.trim()) {
    errors.push("Patient ID is required");
  }
  if (!data.doctorId || typeof data.doctorId !== "string" || !data.doctorId.trim()) {
    errors.push("Doctor ID is required");
  }
  if (!data.grantedBy || typeof data.grantedBy !== "string" || !data.grantedBy.trim()) {
    errors.push("GrantedBy User ID is required");
  }
  if (!data.grantedTo || typeof data.grantedTo !== "string" || !data.grantedTo.trim()) {
    errors.push("GrantedTo User ID is required");
  }
  if (!data.type || typeof data.type !== "string" || !VALID_TYPES.includes(data.type)) {
    errors.push(`Type is required and must be one of: ${VALID_TYPES.join(", ")}`);
  }
  if (!data.scope || !Array.isArray(data.scope) || data.scope.length === 0) {
    errors.push("Scope must be a non-empty array");
  } else {
    const invalidScopes = data.scope.filter((s) => !VALID_SCOPES.includes(s));
    if (invalidScopes.length > 0) {
      errors.push(`Invalid scope values: ${invalidScopes.join(", ")}. Allowed values are: ${VALID_SCOPES.join(", ")}`);
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: "Validation failed", errors });
  }
  next();
};

// جديد: الدكتور بيبعت patientId + type + scope بس (grantedBy/grantedTo بيتحسبوا في الـ service)
export const createConsentRequestValidation = (req, res, next) => {
  const data = req.body || {};
  const errors = [];

  if (!data.patientId || typeof data.patientId !== "string" || !data.patientId.trim()) {
    errors.push("Patient ID is required");
  }
  if (!data.type || typeof data.type !== "string" || !VALID_TYPES.includes(data.type)) {
    errors.push(`Type is required and must be one of: ${VALID_TYPES.join(", ")}`);
  }
  if (!data.scope || !Array.isArray(data.scope) || data.scope.length === 0) {
    errors.push("Scope must be a non-empty array");
  } else {
    const invalidScopes = data.scope.filter((s) => !VALID_SCOPES.includes(s));
    if (invalidScopes.length > 0) {
      errors.push(`Invalid scope values: ${invalidScopes.join(", ")}. Allowed values are: ${VALID_SCOPES.join(", ")}`);
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: "Validation failed", errors });
  }
  next();
};

export const consentIdValidation = (req, res, next) => {
  const id = req.params.id || req.body.id;
  const errors = [];

  if (!id || typeof id !== "string" || !id.trim()) {
    errors.push("Consent ID is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: "Validation failed", errors });
  }
  next();
};