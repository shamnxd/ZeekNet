import { EducationResponseDto } from 'src/application/dto/seeker/seeker-profile-response.dto';
import { UpdateEducationRequestDto } from 'src/application/dto/seeker/seeker-profile.dto';

// be

export interface IUpdateEducationUseCase {
  execute(userId: string, educationId: string, dto: UpdateEducationRequestDto): Promise<EducationResponseDto>;
}
