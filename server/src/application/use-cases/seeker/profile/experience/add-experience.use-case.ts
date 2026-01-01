import { ISeekerProfileRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { ISeekerExperienceRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerExperienceRepository';
import { IAddExperienceUseCase } from 'src/domain/interfaces/use-cases/seeker/profile/experience/IAddExperienceUseCase';
import { NotFoundError, ValidationError } from 'src/domain/errors/errors';
import { SeekerProfileMapper } from 'src/application/mappers/seeker/seeker-profile.mapper';
import { ExperienceResponseDto } from 'src/application/dtos/seeker/profile/info/responses/seeker-profile-response.dto';
import { AddExperienceRequestDto } from 'src/application/dtos/seeker/profile/experience/requests/add-experience-request.dto';

export class AddExperienceUseCase implements IAddExperienceUseCase {
  constructor(
    private readonly _seekerProfileRepository: ISeekerProfileRepository,
    private readonly _seekerExperienceRepository: ISeekerExperienceRepository,
  ) {}

  async execute(dto: AddExperienceRequestDto): Promise<ExperienceResponseDto> {
    const { userId } = dto;
    const startDate = new Date(dto.startDate);
    const endDate = dto.endDate ? new Date(dto.endDate) : undefined;

    if (!dto.title || !dto.company || !dto.startDate || !dto.employmentType) {
      throw new ValidationError('Missing required fields: title, company, startDate, and employmentType are required');
    }
    
    const profile = await this._seekerProfileRepository.findOne({ userId });
    if (!profile) {
      throw new NotFoundError('Seeker profile not found');
    }

    if (endDate && endDate < startDate) {
      throw new ValidationError('End date must be after start date');
    }

    if (dto.isCurrent && endDate) {
      throw new ValidationError('Current experience cannot have an end date');
    }

    const experience = await this._seekerExperienceRepository.createForProfile(
      profile.id,
      SeekerProfileMapper.toExperienceEntity(dto),
    );

    return SeekerProfileMapper.experienceToResponse(experience);
  }
}




