import { IS3Service } from 'src/domain/interfaces/services/IS3Service';
import { ValidationError } from 'src/domain/errors/errors';
import { IFileUploadService } from 'src/domain/interfaces/services/IFileUploadService';
import { UploadedFile } from 'src/domain/types/common.types';

export class FileUploadService implements IFileUploadService {
  constructor(private readonly _s3Service: IS3Service) { }

  private _validateFileType(mimetype: string, filename: string): void {
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

  private _validateFileSize(fileSize: number, maxSizeInMB: number = 5): void {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (fileSize > maxSizeInBytes) {
      throw new ValidationError(`File size must be less than ${maxSizeInMB}MB`);
    }
  }

  async uploadFile(file: UploadedFile, fieldName: string = 'file'): Promise<{ url: string; filename: string }> {
    if (!file) {
      throw new ValidationError(`No ${fieldName} uploaded`);
    }

    const { buffer, originalname, mimetype } = file;

    this._validateFileType(mimetype, originalname);
    this._validateFileSize(file.size, 5);

    const key = await this._s3Service.uploadImage(buffer, originalname, mimetype);

    return {
      url: key,
      filename: originalname,
    };
  }

  async uploadMultipleFiles(files: UploadedFile[], fieldName: string = 'files'): Promise<Array<{ url: string; filename: string }>> {
    if (!files || files.length === 0) {
      throw new ValidationError(`No ${fieldName} uploaded`);
    }

    const uploadPromises = files.map(async (file) => {
      return this.uploadFile(file, fieldName);
    });

    return Promise.all(uploadPromises);
  }

  async deleteFile(fileUrl: string): Promise<void> {
    if (!fileUrl) {
      throw new ValidationError('File URL is required');
    }

    await this._s3Service.deleteImage(fileUrl);
  }

  // Specific upload methods ensuring specific types and folders

  private _validateResumeFileType(mimetype: string, filename: string): void {
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

  async uploadResume(file: UploadedFile, fieldName: string = 'resume'): Promise<{ url: string; filename: string }> {
    if (!file) {
      throw new ValidationError(`No ${fieldName} uploaded`);
    }

    const { buffer, originalname, mimetype } = file;

    this._validateResumeFileType(mimetype, originalname);
    this._validateFileSize(file.size, 5);

    const key = await this._s3Service.uploadResume(buffer, originalname, mimetype);

    return {
      url: key,
      filename: originalname,
    };
  }

  private _validateDocumentFileType(mimetype: string, filename: string): void {
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

  async uploadOfferLetter(file: UploadedFile, fieldName: string = 'document'): Promise<{ url: string; filename: string }> {
    if (!file) {
      throw new ValidationError(`No ${fieldName} uploaded`);
    }

    const { buffer, originalname, mimetype } = file;

    this._validateDocumentFileType(mimetype, originalname);
    this._validateFileSize(file.size, 10);

    const key = await this._s3Service.uploadOfferLetter(buffer, originalname, mimetype);

    return {
      url: key,
      filename: originalname,
    };
  }

  async uploadTaskDocument(file: UploadedFile, fieldName: string = 'document'): Promise<{ url: string; filename: string }> {
    if (!file) {
      throw new ValidationError(`No ${fieldName} uploaded`);
    }

    const { buffer, originalname, mimetype } = file;

    this._validateDocumentFileType(mimetype, originalname);
    this._validateFileSize(file.size, 10);

    const key = await this._s3Service.uploadTaskDocument(buffer, originalname, mimetype);

    return {
      url: key,
      filename: originalname,
    };
  }

  async uploadTaskSubmission(file: UploadedFile, fieldName: string = 'document'): Promise<{ url: string; filename: string }> {
    if (!file) {
      throw new ValidationError(`No ${fieldName} uploaded`);
    }

    const { buffer, originalname, mimetype } = file;

    this._validateDocumentFileType(mimetype, originalname);
    this._validateFileSize(file.size, 10);

    const key = await this._s3Service.uploadTaskSubmission(buffer, originalname, mimetype);

    return {
      url: key,
      filename: originalname,
    };
  }
}
