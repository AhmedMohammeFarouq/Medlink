import { ConsentService } from './consent.service.js';

export class ConsentController {
  static async create(req, res, next) {
    try {
      const consent = await ConsentService.createConsent(req.body);
      res.status(201).json({ success: true, data: consent });
    } catch (err) { next(err); }
  }

  static async getPatientConsents(req, res, next) {
    try {
      const consents = await ConsentService.getPatientConsents(req.params.patientId);
      res.status(200).json({ success: true, data: consents });
    } catch (err) { next(err); }
  }

  static async getById(req, res, next) {
    try {
      const consent = await ConsentService.getConsentById(req.params.id);
      res.status(200).json({ success: true, data: consent });
    } catch (err) { next(err); }
  }

  static async approve(req, res, next) {
    try {
      const consent = await ConsentService.approveConsent(req.params.id);
      res.status(200).json({ success: true, data: consent });
    } catch (err) { next(err); }
  }

  static async revoke(req, res, next) {
    try {
      const consent = await ConsentService.revokeConsent(req.params.id, req.user?.id, req.body.revocationReason);
      res.status(200).json({ success: true, data: consent });
    } catch (err) { next(err); }
  }

  // Endpoint to check permission-based access dynamically
  static async checkAccess(req, res, next) {
    try {
      const { patientId, grantedTo, permission } = req.query;
      const hasAccess = await ConsentService.checkPermission(patientId, grantedTo, permission);
      res.status(200).json({ success: true, hasAccess });
    } catch (err) { next(err); }
  }
}