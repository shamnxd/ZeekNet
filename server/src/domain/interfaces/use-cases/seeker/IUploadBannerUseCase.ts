import { SeekerProfileResponseDto } from 'src/application/dtos/seeker/responses/seeker-profile-response.dto';
import { UploadBannerDto } from 'src/application/dtos/seeker/common/upload-banner.dto';

export interface IUploadBannerUseCase {
  execute(dto: UploadBannerDto): Promise<SeekerProfileResponseDto>;
}

