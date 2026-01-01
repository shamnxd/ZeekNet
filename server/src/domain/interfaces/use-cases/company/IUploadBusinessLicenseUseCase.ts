import { UploadBusinessLicenseResult } from 'src/application/dtos/company/common/upload-business-license-result.dto';
import { UploadBusinessLicenseDto } from 'src/application/dtos/company/common/upload-business-license.dto';

export interface IUploadBusinessLicenseUseCase {
  execute(dto: UploadBusinessLicenseDto): Promise<UploadBusinessLicenseResult>;
}

