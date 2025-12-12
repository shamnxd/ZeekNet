import { UploadLogoRequestDto } from 'src/application/dto/company/upload-logo.dto';
import { UploadLogoResult } from 'src/application/dto/public/upload-logo-result.dto';


export interface IUploadLogoUseCase {
  execute(data: UploadLogoRequestDto): Promise<UploadLogoResult>;
}
