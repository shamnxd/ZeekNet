import { ExperienceResponseDto } from 'src/application/dto/seeker/seeker-profile-response.dto';
import { UpdateExperienceRequestDto } from 'src/application/dto/seeker/update-experience-request.dto';

export interface IUpdateExperienceUseCase {
  execute(dto: UpdateExperienceRequestDto): Promise<ExperienceResponseDto>;
}
