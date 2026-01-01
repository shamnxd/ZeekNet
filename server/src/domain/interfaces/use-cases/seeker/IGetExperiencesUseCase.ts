import { ExperienceResponseDto } from 'src/application/dtos/seeker/responses/seeker-profile-response.dto';


export interface IGetExperiencesUseCase {
  execute(userId: string): Promise<ExperienceResponseDto[]>;
}

