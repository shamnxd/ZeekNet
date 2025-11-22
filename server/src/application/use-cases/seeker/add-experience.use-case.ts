import { ISeekerProfileRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { ISeekerExperienceRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerExperienceRepository';
import { IAddExperienceUseCase, AddExperienceData } from '../../../domain/interfaces/use-cases/ISeekerUseCases';
import { NotFoundError, ValidationError } from '../../../domain/errors/errors';
import { SeekerProfileMapper } from '../../mappers/seeker-profile.mapper';
import { ExperienceResponseDto } from '../../dto/seeker/seeker-profile-response.dto';

export class AddExperienceUseCase implements IAddExperienceUseCase {
  constructor(
    private readonly _seekerProfileRepository: ISeekerProfileRepository,
    private readonly _seekerExperienceRepository: ISeekerExperienceRepository,
  ) {}

  async execute(userId: string, data: AddExperienceData): Promise<ExperienceResponseDto> {
    
    const profile = await this._seekerProfileRepository.findOne({ userId });
    if (!profile) {
      throw new NotFoundError('Seeker profile not found');
    }

    if (data.endDate && data.endDate < data.startDate) {
      throw new ValidationError('End date must be after start date');
    }

    if (data.isCurrent && data.endDate) {
      throw new ValidationError('Current experience cannot have an end date');
    }

    const experience = await this._seekerExperienceRepository.createForProfile(profile.id, {
      title: data.title,
      company: data.company,
      startDate: data.startDate,
      endDate: data.endDate,
      employmentType: data.employmentType,
      location: data.location,
      description: data.description,
      technologies: data.technologies || [],
      isCurrent: data.isCurrent || false,
    });

    return SeekerProfileMapper.experienceToDto(experience);
  }
}


