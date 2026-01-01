import { UploadLogoRequestDto } from 'src/application/dtos/company/media/requests/upload-logo.dto';
import { UploadLogoResult } from 'src/application/dtos/company/media/responses/upload-logo-result.dto';


export interface IUploadLogoUseCase {
  execute(data: UploadLogoRequestDto): Promise<UploadLogoResult>;
}

