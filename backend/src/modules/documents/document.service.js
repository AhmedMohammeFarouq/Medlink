import cloudinary from '../../config/cloudinary.js';
import  DocumentModel  from './document.model.js';

export class DocumentService {

  static async uploadToCloudinary(fileBuffer, originalName) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'medlink_documents',
          resource_type: 'auto',
          public_id: `doc_${Date.now()}_${originalName.replace(/\.[^/.]+$/, '')}`
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      uploadStream.end(fileBuffer);
    });
  }

  static async deleteFromCloudinary(publicId) {
    if (!publicId) return;
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error deleting file from Cloudinary:', error);
    }
  }

  static async createDocument(documentData) {
    return await DocumentModel.create(documentData);
  }

  static async getPatientDocuments(patientId) {
    return await DocumentModel.find({ patientId }).sort({ createdAt: -1 });
  }

  static async getDocumentById(id) {
    return await DocumentModel.findById(id);
  }

  static async deleteDocument(id) {
    const document = await DocumentModel.findById(id);
    if (!document) return null;

    if (document.fileReference?.fileKey && document.fileReference?.storageProvider === 'CLOUDINARY') {
      await this.deleteFromCloudinary(document.fileReference.fileKey);
    }

    return await DocumentModel.findByIdAndDelete(id);
  }
}