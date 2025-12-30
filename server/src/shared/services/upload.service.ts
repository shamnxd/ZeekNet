import { Request } from 'express';
import { ValidationError } from '../../domain/errors/errors';
import { IS3Service } from '../../domain/interfaces/services/IS3Service';

export class UploadService {
  
  private static validateFileType(mimetype: string, filename: string): void {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.doc', '.docx'];

    const fileExtension = filename.toLowerCase().substring(filename.lastIndexOf('.'));

    if (!allowedTypes.includes(mimetype) && !allowedExtensions.includes(fileExtension)) {
      throw new ValidationError(`File type ${mimetype} is not allowed`);
    }
  }

  static validateFileSize(fileSize: number, maxSizeInMB: number = 5): void {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (fileSize > maxSizeInBytes) {
      throw new ValidationError(`File size must be less than ${maxSizeInMB}MB`);
    }
  }

  static extractFileInfo(
    req: Request,
    fieldName: string = 'file',
  ): {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
  } | null {
    const file = req.file;

    if (!file) {
      return null;
    }

    return {
      buffer: file.buffer,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };
  }

  static extractMultipleFileInfo(
    req: Request,
    fieldName: string = 'files',
  ): Array<{
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
  }> {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return [];
    }

    return files.map((file) => ({
      buffer: file.buffer,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    }));
  }

  static async handleFileUpload(req: Request, s3Service: IS3Service, fieldName: string = 'file'): Promise<{ url: string; filename: string }> {
    const file = req.file;

    if (!file) {
      throw new ValidationError(`No ${fieldName} uploaded`);
    }

    const { buffer, originalname, mimetype } = file;

    this.validateFileType(mimetype, originalname);

    const key = await s3Service.uploadImage(buffer, originalname, mimetype);

    return {
      url: key,
      filename: originalname,
    };
  }

  static async handleMultipleFileUpload(req: Request, s3Service: IS3Service, fieldName: string = 'files'): Promise<Array<{ url: string; filename: string }>> {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      throw new ValidationError(`No ${fieldName} uploaded`);
    }

    const uploadPromises = files.map(async (file) => {
      const { buffer, originalname, mimetype } = file;

      this.validateFileType(mimetype, originalname);

      const key = await s3Service.uploadImage(buffer, originalname, mimetype);

      return {
        url: key,
        filename: originalname,
      };
    });

    return Promise.all(uploadPromises);
  }

  static async handleFileDeletion(imageUrl: string, s3Service: IS3Service): Promise<void> {
    if (!imageUrl) {
      throw new ValidationError('Image URL is required');
    }

    await s3Service.deleteImage(imageUrl);
  }

  private static validateResumeFileType(mimetype: string, filename: string): void {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const fileExtension = filename.toLowerCase().substring(filename.lastIndexOf('.'));

    if (!allowedTypes.includes(mimetype) && !allowedExtensions.includes(fileExtension)) {
      throw new ValidationError('Only PDF, DOC, and DOCX files are allowed for resumes');
    }
  }

  static async handleResumeUpload(req: Request, s3Service: IS3Service, fieldName: string = 'resume'): Promise<{ url: string; filename: string }> {
    const file = req.file;

    if (!file) {
      throw new ValidationError(`No ${fieldName} uploaded`);
    }

    const { buffer, originalname, mimetype } = file;

    this.validateResumeFileType(mimetype, originalname);
    this.validateFileSize(file.size, 5);

    let resumeKey: string;
    if (typeof s3Service.uploadResume === 'function') {
      resumeKey = await s3Service.uploadResume(buffer, originalname, mimetype);
    } else {
      resumeKey = await s3Service.uploadImageToFolder(buffer, originalname, mimetype, 'resumes');
    }

    return {
      url: resumeKey,
      filename: originalname,
    };
  }

  private static validateDocumentFileType(mimetype: string, filename: string): void {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip',
      'application/x-zip-compressed',
    ];

    const allowedExtensions = ['.pdf', '.doc', '.docx', '.zip'];
    const fileExtension = filename.toLowerCase().substring(filename.lastIndexOf('.'));

    if (!allowedTypes.includes(mimetype) && !allowedExtensions.includes(fileExtension)) {
      throw new ValidationError('Only PDF, DOC, DOCX, and ZIP files are allowed');
    }
  }

  static async handleOfferLetterUpload(req: Request, s3Service: IS3Service, fieldName: string = 'document'): Promise<{ url: string; filename: string }> {
    const file = req.file;

    if (!file) {
      throw new ValidationError(`No ${fieldName} uploaded`);
    }

    const { buffer, originalname, mimetype } = file;

    this.validateDocumentFileType(mimetype, originalname);
    this.validateFileSize(file.size, 10);

    let offerKey: string;
    interface ExtendedS3Service extends IS3Service {
      uploadOfferLetter?: (file: Buffer, fileName: string, contentType: string) => Promise<string>;
    }
    if (typeof (s3Service as ExtendedS3Service).uploadOfferLetter === 'function') {
      offerKey = await (s3Service as ExtendedS3Service).uploadOfferLetter!(buffer, originalname, mimetype);
    } else {
      offerKey = await s3Service.uploadImageToFolder(buffer, originalname, mimetype, 'offer-letters');
    }

    return {
      url: offerKey,
      filename: originalname,
    };
  }

  static async handleTaskDocumentUpload(req: Request, s3Service: IS3Service, fieldName: string = 'document'): Promise<{ url: string; filename: string }> {
    const file = req.file;

    if (!file) {
      throw new ValidationError(`No ${fieldName} uploaded`);
    }

    const { buffer, originalname, mimetype } = file;

    this.validateDocumentFileType(mimetype, originalname);
    this.validateFileSize(file.size, 10);

    let taskKey: string;
    interface ExtendedS3Service extends IS3Service {
      uploadTaskDocument?: (file: Buffer, fileName: string, contentType: string) => Promise<string>;
    }
    if (typeof (s3Service as ExtendedS3Service).uploadTaskDocument === 'function') {
      taskKey = await (s3Service as ExtendedS3Service).uploadTaskDocument!(buffer, originalname, mimetype);
    } else {
      taskKey = await s3Service.uploadImageToFolder(buffer, originalname, mimetype, 'task-documents');
    }

    return {
      url: taskKey,
      filename: originalname,
    };
  }

  static async handleTaskSubmissionUpload(req: Request, s3Service: IS3Service, fieldName: string = 'document'): Promise<{ url: string; filename: string }> {
    const file = req.file;

    if (!file) {
      throw new ValidationError(`No ${fieldName} uploaded`);
    }

    const { buffer, originalname, mimetype } = file;

    this.validateDocumentFileType(mimetype, originalname);
    this.validateFileSize(file.size, 10);

    let submissionKey: string;
    interface ExtendedS3Service extends IS3Service {
      uploadTaskSubmission?: (file: Buffer, fileName: string, contentType: string) => Promise<string>;
    }
    if (typeof (s3Service as ExtendedS3Service).uploadTaskSubmission === 'function') {
      submissionKey = await (s3Service as ExtendedS3Service).uploadTaskSubmission!(buffer, originalname, mimetype);
    } else {
      submissionKey = await s3Service.uploadImageToFolder(buffer, originalname, mimetype, 'task-submissions');
    }

    return {
      url: submissionKey,
      filename: originalname,
    };
  }
}