import { ExperienceResponseDto } from 'src/application/dtos/seeker/responses/seeker-profile-response.dto';
import { UpdateExperienceRequestDto } from 'src/application/dtos/seeker/requests/update-experience-request.dto';

export interface IUpdateExperienceUseCase {
  execute(dto: UpdateExperienceRequestDto): Promise<ExperienceResponseDto>;
}

