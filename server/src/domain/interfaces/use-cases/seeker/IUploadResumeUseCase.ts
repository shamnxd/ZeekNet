import { ResumeMetaResponseDto } from 'src/application/dto/seeker/seeker-profile-response.dto';
import { UploadResumeRequestDto } from 'src/application/dto/seeker/seeker-profile.dto';

export interface IUploadResumeUseCase {
  execute(dto: UploadResumeRequestDto): Promise<ResumeMetaResponseDto>;
}
