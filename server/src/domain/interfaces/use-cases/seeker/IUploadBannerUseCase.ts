import { SeekerProfileResponseDto } from 'src/application/dto/seeker/seeker-profile-response.dto';

// be

export interface IUploadBannerUseCase {
  execute(userId: string, fileBuffer: Buffer, fileName: string, mimeType: string): Promise<SeekerProfileResponseDto>;
}
