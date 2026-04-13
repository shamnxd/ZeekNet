import { ISeekerProfileRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { ISeekerEducationRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerEducationRepository';
import { IGetEducationUseCase } from 'src/domain/interfaces/use-cases/seeker/profile/education/IGetEducationUseCase';
import { NotFoundError } from 'src/domain/errors/errors';
import { SeekerProfileMapper } from 'src/application/mappers/seeker/seeker-profile.mapper';
import { EducationResponseDto } from 'src/application/dtos/seeker/profile/info/responses/seeker-profile-response.dto';

import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ERROR } from 'src/shared/constants/messages';


@injectable()
export class GetEducationUseCase implements IGetEducationUseCase {
  constructor(
    @inject(TYPES.SeekerProfileRepository) private readonly _seekerProfileRepository: ISeekerProfileRepository,
    @inject(TYPES.SeekerEducationRepository) private readonly _seekerEducationRepository: ISeekerEducationRepository,
  ) {}

  async execute(userId: string): Promise<EducationResponseDto[]> {
    
    const profile = await this._seekerProfileRepository.findOne({ userId });
    if (!profile) {
      throw new NotFoundError(ERROR.NOT_FOUND('Seeker profile'));
    }

    const education = await this._seekerEducationRepository.findBySeekerProfileId(profile.id);
    return education.map(edu => SeekerProfileMapper.educationToResponse(edu));
  }
}




