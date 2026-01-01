import { UploadLogoRequestDto } from 'src/application/dtos/company/common/upload-logo.dto';
import { UploadLogoResult } from 'src/application/dtos/public/common/upload-logo-result.dto';


export interface IUploadLogoUseCase {
  execute(data: UploadLogoRequestDto): Promise<UploadLogoResult>;
}

