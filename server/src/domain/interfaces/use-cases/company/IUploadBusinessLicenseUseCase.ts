import { UploadBusinessLicenseResult } from './UploadBusinessLicenseResult';

// be

export interface IUploadBusinessLicenseUseCase {
  execute(buffer: Buffer, originalname: string, mimetype: string): Promise<UploadBusinessLicenseResult>;
}
