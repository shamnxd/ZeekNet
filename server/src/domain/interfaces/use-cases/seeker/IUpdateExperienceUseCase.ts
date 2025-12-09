import { ExperienceResponseDto } from 'src/application/dto/seeker/seeker-profile-response.dto';
import { UpdateExperienceRequestDto } from 'src/application/dto/seeker/seeker-profile.dto';

// be

export interface IUpdateExperienceUseCase {
  execute(userId: string, experienceId: string, dto: UpdateExperienceRequestDto): Promise<ExperienceResponseDto>;
}
