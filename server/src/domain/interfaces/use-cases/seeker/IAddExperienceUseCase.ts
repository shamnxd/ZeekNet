import { ExperienceResponseDto } from 'src/application/dto/seeker/seeker-profile-response.dto';
import { AddExperienceRequestDto } from 'src/application/dto/seeker/add-experience-request.dto';

export interface IAddExperienceUseCase {
  execute(dto: AddExperienceRequestDto): Promise<ExperienceResponseDto>;
}
