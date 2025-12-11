import { UploadBusinessLicenseResult } from 'src/application/dto/company/upload-business-license-result.dto';
import { UploadBusinessLicenseDto } from 'src/application/dto/company/upload-business-license.dto';

export interface IUploadBusinessLicenseUseCase {
  execute(dto: UploadBusinessLicenseDto): Promise<UploadBusinessLicenseResult>;
}
