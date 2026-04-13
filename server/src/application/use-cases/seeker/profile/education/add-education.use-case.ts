import { ISeekerProfileRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { ISeekerEducationRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerEducationRepository';
import { IAddEducationUseCase } from 'src/domain/interfaces/use-cases/seeker/profile/education/IAddEducationUseCase';
import { NotFoundError, ValidationError } from 'src/domain/errors/errors';
import { SeekerProfileMapper } from 'src/application/mappers/seeker/seeker-profile.mapper';
import { EducationResponseDto } from 'src/application/dtos/seeker/profile/info/responses/seeker-profile-response.dto';
import { AddEducationRequestDto } from 'src/application/dtos/seeker/profile/education/requests/add-education-request.dto';

import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ERROR } from 'src/shared/constants/messages';


@injectable()
export class AddEducationUseCase implements IAddEducationUseCase {
  constructor(
    @inject(TYPES.SeekerProfileRepository) private readonly _seekerProfileRepository: ISeekerProfileRepository,
    @inject(TYPES.SeekerEducationRepository) private readonly _seekerEducationRepository: ISeekerEducationRepository,
  ) {}

  async execute(userId: string, dto: AddEducationRequestDto): Promise<EducationResponseDto> {
    const startDate = new Date(dto.startDate);
    const endDate = dto.endDate ? new Date(dto.endDate) : undefined;

    if (!dto.school || !dto.startDate) {
      throw new ValidationError('Missing required fields: school and startDate are required');
    }
    
    const profile = await this._seekerProfileRepository.findOne({ userId });
    if (!profile) {
      throw new NotFoundError(ERROR.NOT_FOUND('Seeker profile'));
    }

    if (endDate && endDate < startDate) {
      throw new ValidationError('End date must be after start date');
    }

    const education = await this._seekerEducationRepository.createForProfile(
      profile.id,
      SeekerProfileMapper.toEducationEntity(dto),
    );

    return SeekerProfileMapper.educationToResponse(education);
  }
}


