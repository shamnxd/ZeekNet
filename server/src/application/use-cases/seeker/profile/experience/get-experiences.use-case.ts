import { ISeekerProfileRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { ISeekerExperienceRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerExperienceRepository';
import { NotFoundError } from 'src/domain/errors/errors';
import { SeekerProfileMapper } from 'src/application/mappers/seeker/seeker-profile.mapper';
import { ExperienceResponseDto } from 'src/application/dtos/seeker/profile/info/responses/seeker-profile-response.dto';
import { IGetExperiencesUseCase } from 'src/domain/interfaces/use-cases/seeker/profile/experience/IGetExperiencesUseCase';

export class GetExperiencesUseCase implements IGetExperiencesUseCase {
  constructor(
    private readonly _seekerProfileRepository: ISeekerProfileRepository,
    private readonly _seekerExperienceRepository: ISeekerExperienceRepository,
  ) {}

  async execute(userId: string): Promise<ExperienceResponseDto[]> {
    
    const profile = await this._seekerProfileRepository.findOne({ userId });
    if (!profile) {
      throw new NotFoundError('Seeker profile not found');
    }

    const experiences = await this._seekerExperienceRepository.findBySeekerProfileId(profile.id);
    return experiences.map(exp => SeekerProfileMapper.experienceToResponse(exp));
  }
}




