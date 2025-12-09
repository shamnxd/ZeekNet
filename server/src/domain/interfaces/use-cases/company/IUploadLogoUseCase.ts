import { UploadLogoRequestDto } from 'src/application/dto/company/upload-logo.dto';
import { UploadLogoResult } from '../public/UploadLogoResult';


export interface IUploadLogoUseCase {
  execute(data: UploadLogoRequestDto): Promise<UploadLogoResult>;
}
