import { ISeekerProfileRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { ISeekerEducationRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerEducationRepository';
import { IGetEducationUseCase } from 'src/domain/interfaces/use-cases/seeker/profile/education/IGetEducationUseCase';
import { NotFoundError } from 'src/domain/errors/errors';
import { SeekerProfileMapper } from 'src/application/mappers/seeker/seeker-profile.mapper';
import { EducationResponseDto } from 'src/application/dtos/seeker/profile/info/responses/seeker-profile-response.dto';

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




