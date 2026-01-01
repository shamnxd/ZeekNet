import { ISeekerProfileRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { ISeekerEducationRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerEducationRepository';
import { IGetEducationUseCase } from '../../../domain/interfaces/use-cases/seeker/IGetEducationUseCase';
import { NotFoundError } from '../../../domain/errors/errors';
import { SeekerProfileMapper } from '../../mappers/seeker/seeker-profile.mapper';
import { EducationResponseDto } from '../../dtos/seeker/responses/seeker-profile-response.dto';

export class GetEducationUseCase implements IGetEducationUseCase {
  constructor(
    private readonly _seekerProfileRepository: ISeekerProfileRepository,
    private readonly _seekerEducationRepository: ISeekerEducationRepository,
  ) {}

  async execute(userId: string): Promise<EducationResponseDto[]> {
    
    const profile = await this._seekerProfileRepository.findOne({ userId });
    if (!profile) {
      throw new NotFoundError('Seeker profile not found');
    }

    const education = await this._seekerEducationRepository.findBySeekerProfileId(profile.id);
    return education.map(edu => SeekerProfileMapper.educationToResponse(edu));
  }
}




