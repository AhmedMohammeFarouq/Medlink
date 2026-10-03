import { ConsentService } from './consent.service.js';
import Consent from './consent.model.js';
import * as patientService from '../patients/patient.service.js';

export class ConsentController {
  static async getMyConsents(req, res, next) {
    try {
      if (req.user && req.user.role === 'PATIENT') {
        const patient = await patientService.getOrCreatePatientProfile(req.user.userId);
        const patientId = patient ? patient._id : req.user.userId;
        const consents = await ConsentService.getPatientConsents(patientId);
        return res.status(200).json({ success: true, data: consents || [] });
      }

      let consents = [];
      if (req.user && req.user.role === 'DOCTOR') {
        consents = await Consent.find({ grantedTo: req.user.userId }).sort({ createdAt: -1 });
      } else {
        consents = await Consent.find().sort({ createdAt: -1 }).limit(50);
      }
      return res.status(200).json({ success: true, data: consents || [] });
    } catch (err) { next(err); }
  }
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