import { ExperienceResponseDto } from 'src/application/dtos/seeker/responses/seeker-profile-response.dto';
import { AddExperienceRequestDto } from 'src/application/dtos/seeker/common/add-experience-request.dto';

export interface IAddExperienceUseCase {
  execute(dto: AddExperienceRequestDto): Promise<ExperienceResponseDto>;
}

