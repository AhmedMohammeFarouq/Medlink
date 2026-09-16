import Consent from './consent.model.js';

const httpError = (status, message) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

export class ConsentService {
  static async createConsent(data) {
    return await Consent.create(data);
  }

  static async createConsentRequest({ patientId, doctorId, type, scope, reason }) {
    return await Consent.create({
      patientId,
      doctorId,
      grantedTo: doctorId,   
      grantedBy: patientId,  
      type,
      scope,
      reason: reason || null,
      status: 'PENDING',
    });
  }

  static async getPatientConsents(patientId) {
    return await Consent.find({ patientId }).sort({ createdAt: -1 });
  }

  static async getConsentById(id) {
    return await Consent.findById(id);
  }

  static async approveConsent(consentId, requestingUserId) {
    const consent = await Consent.findById(consentId);
    if (!consent) throw httpError(404, 'Consent not found');
    if (consent.patientId.toString() !== requestingUserId) throw httpError(403, 'Access denied');
    if (consent.status !== 'PENDING') throw httpError(400, `Cannot approve a consent with status ${consent.status}`);
    consent.status = 'GRANTED';
    consent.grantedAt = new Date();
    return await consent.save();
  }

  static async rejectConsent(consentId, requestingUserId) {
    const consent = await Consent.findById(consentId);
    if (!consent) throw httpError(404, 'Consent not found');
    if (consent.patientId.toString() !== requestingUserId) throw httpError(403, 'Access denied');
    if (consent.status !== 'PENDING') throw httpError(400, `Cannot reject a consent with status ${consent.status}`);
    consent.status = 'REJECTED';
    return await consent.save();
  }

  static async revokeConsent(consentId, userId, revocationReason) {
    return await Consent.findByIdAndUpdate(
      consentId,
      { status: 'REVOKED', revokedAt: new Date(), revokedBy: userId, revocationReason },
      { new: true }
    );
  }

  static async checkPermission(patientId, grantedToId, requiredPermission) {
    const consent = await Consent.findOne({
      patientId,
      grantedTo: grantedToId,
      status: 'GRANTED',
      $or: [{ scope: requiredPermission }, { type: 'FULL_ACCESS' }],
    });
    if (!consent) return false;
    if (consent.expiresAt && new Date() > new Date(consent.expiresAt)) {
      consent.status = 'EXPIRED';
      await consent.save();
      return false;
    }
    return true;
  }
}