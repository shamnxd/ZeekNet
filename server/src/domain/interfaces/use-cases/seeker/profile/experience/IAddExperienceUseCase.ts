import { ExperienceResponseDto } from 'src/application/dtos/seeker/profile/info/responses/seeker-profile-response.dto';
import { AddExperienceRequestDto } from 'src/application/dtos/seeker/profile/experience/requests/add-experience-request.dto';

export interface IAddExperienceUseCase {
  execute(dto: AddExperienceRequestDto): Promise<ExperienceResponseDto>;
}

