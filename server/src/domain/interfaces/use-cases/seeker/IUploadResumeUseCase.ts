import { ResumeMetaResponseDto } from 'src/application/dto/seeker/seeker-profile-response.dto';
import { UploadResumeRequestDto } from 'src/application/dto/seeker/seeker-profile.dto';

//be

export interface IUploadResumeUseCase {
  execute(userId: string, dto: UploadResumeRequestDto): Promise<ResumeMetaResponseDto>;
}
