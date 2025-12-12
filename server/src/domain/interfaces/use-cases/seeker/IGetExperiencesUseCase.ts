import { ExperienceResponseDto } from 'src/application/dto/seeker/seeker-profile-response.dto';


export interface IGetExperiencesUseCase {
  execute(userId: string): Promise<ExperienceResponseDto[]>;
}
