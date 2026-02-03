import { UploadedFile } from 'src/domain/types/common.types';

export interface IFileUploadService {
    uploadFile(file: UploadedFile, fieldName?: string): Promise<{ url: string; filename: string }>;
    uploadMultipleFiles(files: UploadedFile[], fieldName?: string): Promise<Array<{ url: string; filename: string }>>;
    deleteFile(fileUrl: string): Promise<void>;
    uploadResume(file: UploadedFile, fieldName?: string): Promise<{ url: string; filename: string }>;
    uploadOfferLetter(file: UploadedFile, fieldName?: string): Promise<{ url: string; filename: string }>;
    uploadTaskDocument(file: UploadedFile, fieldName?: string): Promise<{ url: string; filename: string }>;
    uploadTaskSubmission(file: UploadedFile, fieldName?: string): Promise<{ url: string; filename: string }>;
}
