import { SeekerProfileResponseDto } from 'src/application/dtos/seeker/profile/info/responses/seeker-profile-response.dto';
import { UploadBannerDto } from 'src/application/dtos/seeker/media/requests/upload-banner.dto';

export interface IUploadBannerUseCase {
  execute(dto: UploadBannerDto): Promise<SeekerProfileResponseDto>;
}

