import { ResumeMetaResponseDto } from 'src/application/dtos/seeker/profile/info/responses/seeker-profile-response.dto';
import { UploadResumeRequestDto } from 'src/application/dtos/seeker/media/requests/seeker-profile.dto';

export interface IUploadResumeUseCase {
  execute(dto: UploadResumeRequestDto): Promise<ResumeMetaResponseDto>;
}

