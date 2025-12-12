import { SeekerProfileResponseDto } from 'src/application/dto/seeker/seeker-profile-response.dto';
import { UploadBannerDto } from 'src/application/dto/seeker/upload-banner.dto';

export interface IUploadBannerUseCase {
  execute(dto: UploadBannerDto): Promise<SeekerProfileResponseDto>;
}
