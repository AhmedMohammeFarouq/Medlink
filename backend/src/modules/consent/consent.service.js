import Consent from './consent.model.js';

export class ConsentService {
  // 1. Create Consent
  static async createConsent(data) {
    return await Consent.create(data);
  }

  // 2. Retrieve Consents
  static async getPatientConsents(patientId) {
    return await Consent.find({ patientId }).sort({ createdAt: -1 });
  }

  static async getConsentById(id) {
    return await Consent.findById(id);
  }

  // 3. Approve Consent
  static async approveConsent(consentId) {
    return await Consent.findByIdAndUpdate(
      consentId,
      { status: 'GRANTED', grantedAt: new Date() },
      { new: true }
    );
  }

  // 4. Revoke Consent
  static async revokeConsent(consentId, userId, revocationReason) {
    return await Consent.findByIdAndUpdate(
      consentId,
      {
        status: 'REVOKED',
        revokedAt: new Date(),
        revokedBy: userId,
        revocationReason
      },
      { new: true }
    );
  }

  // 5. Permission-based access check + Expiration check + Status check
  static async checkPermission(patientId, grantedToId, requiredPermission) {
    const consent = await Consent.findOne({
      patientId,
      grantedTo: grantedToId,
      status: 'GRANTED',
      $or: [
        { scope: requiredPermission },
        { type: 'FULL_ACCESS' }
      ]
    });

    if (!consent) return false;

    // Expiration check
    if (consent.expiresAt && new Date() > new Date(consent.expiresAt)) {
      // Auto-update status to EXPIRED
      consent.status = 'EXPIRED';
      await consent.save();
      return false;
    }

    return true;
  }
}