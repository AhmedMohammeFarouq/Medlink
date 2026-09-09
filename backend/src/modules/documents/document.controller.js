import { DocumentService } from './document.service.js';

export class DocumentController {
  static async uploadAndCreate(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'Please upload a file' });
      }

      const cloudinaryResult = await DocumentService.uploadToCloudinary(
        req.file.buffer,
        req.file.originalname
      );

      const documentData = {
        // title: req.body.title || req.file.originalname,
        // patientId: req.body.patientId,
        // uploadedBy: req.body.uploadedBy,
        // type: req.body.type || 'OTHER',

         title: req.body.title || 'Untitled Document',
        name: req.body.name || req.body.title || 'Document',
        patientId: req.body.patientId,
        uploadedBy: req.body.uploadedBy,
        type: req.body.type || 'LAB_RESULT', // Enforce correct ENUM
        fileUrl: cloudinaryResult.secure_url, // If schema expects root fileUrl

        fileReference: {
          storageProvider: 'CLOUDINARY',
          fileUrl: cloudinaryResult.secure_url,
          fileKey: cloudinaryResult.public_id,
          mimeType: req.file.mimetype,
          fileSizeBytes: req.file.size
        },
        metadata: req.body.metadata ? JSON.parse(req.body.metadata) : {},
        accessMetadata: {
          isConfidential: req.body.isConfidential === 'true',
          allowedRoles: req.body.allowedRoles ? JSON.parse(req.body.allowedRoles) : ['DOCTOR', 'PATIENT']
        }
      };

      const document = await DocumentService.createDocument(documentData);
      res.status(201).json({ success: true, data: document });
    } catch (err) {
      next(err);
    }
  }

  static async getByPatient(req, res, next) {
    try {
      const documents = await DocumentService.getPatientDocuments(req.params.patientId);
      res.status(200).json({ success: true, count: documents.length, data: documents });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const document = await DocumentService.getDocumentById(req.params.id);
      if (!document) {
        return res.status(404).json({ success: false, message: 'Document not found' });
      }
      res.status(200).json({ success: true, data: document });
    } catch (err) {
      next(err);
    }
  }

  // دالة الحذف
  static async delete(req, res, next) {
    try {
      const deletedDoc = await DocumentService.deleteDocument(req.params.id);
      if (!deletedDoc) {
        return res.status(404).json({ success: false, message: 'Document not found' });
      }
      res.status(200).json({ success: true, message: 'Document and associated file deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}