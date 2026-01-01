import { ISeekerProfileRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { ISeekerExperienceRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerExperienceRepository';
import { NotFoundError } from '../../../domain/errors/errors';
import { SeekerProfileMapper } from '../../mappers/seeker/seeker-profile.mapper';
import { ExperienceResponseDto } from '../../dtos/seeker/responses/seeker-profile-response.dto';
import { IGetExperiencesUseCase } from 'src/domain/interfaces/use-cases/seeker/IGetExperiencesUseCase';

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




