import cloudinary, { uploadDocument } from '../../config/cloudinary.js';
import DocumentModel from './document.model.js';

export class DocumentService {


    static createDocumentService = async ({ file, body, userId }) => {
        // التأكد من وجود الملف القادم من Multer
        if (!file) {
            throw new Error('No document file provided.');
        }

        // 1. رفع الـ Buffer إلى Cloudinary
        const uploadResult = await uploadDocument(
            file.buffer,
            `medlink/documents/${body.patientId}`
        );

        // 2. حفظ الـ Metadata فقط في MongoDB
        const document = await Document.create({
            patientId: body.patientId,
            uploadedBy: userId,
            documentType: body.documentType, // مثل: 'LAB_RESULT', 'X_RAY'
            fileName: file.originalname,
            mimeType: file.mimetype,
            storageKey: uploadResult.public_id || uploadResult.storageKey,
            fileUrl: uploadResult.secure_url || uploadResult.fileUrl,
            fileSize: file.size,
            storageProvider: uploadResult.storageProvider || 'CLOUDINARY',
        });

        return document;
    };

    static async deleteFromCloudinary(publicId) {
        if (!publicId) return;
        try {
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,
            });
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