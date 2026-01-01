import { ResumeMetaResponseDto } from 'src/application/dtos/seeker/responses/seeker-profile-response.dto';
import { UploadResumeRequestDto } from 'src/application/dtos/seeker/common/seeker-profile.dto';

export interface IUploadResumeUseCase {
  execute(dto: UploadResumeRequestDto): Promise<ResumeMetaResponseDto>;
}

