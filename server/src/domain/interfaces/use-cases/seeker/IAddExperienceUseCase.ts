import { ExperienceResponseDto } from 'src/application/dto/seeker/seeker-profile-response.dto';
import { AddExperienceRequestDto } from 'src/application/dto/seeker/seeker-profile.dto';

// be

export interface IAddExperienceUseCase {
  execute(userId: string, dto: AddExperienceRequestDto): Promise<ExperienceResponseDto>;
}
