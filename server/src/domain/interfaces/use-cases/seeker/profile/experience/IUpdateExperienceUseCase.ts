import { ExperienceResponseDto } from 'src/application/dtos/seeker/profile/info/responses/seeker-profile-response.dto';
import { UpdateExperienceRequestDto } from 'src/application/dtos/seeker/profile/experience/requests/update-experience-request.dto';

export interface IUpdateExperienceUseCase {
  execute(dto: UpdateExperienceRequestDto): Promise<ExperienceResponseDto>;
}

