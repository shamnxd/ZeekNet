import { ISeekerProfileRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { ISeekerExperienceRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerExperienceRepository';
import { IUpdateExperienceUseCase, UpdateExperienceData } from '../../../domain/interfaces/use-cases/ISeekerUseCases';
import { Experience } from '../../../domain/entities/seeker-profile.entity';
import { NotFoundError, ValidationError } from '../../../domain/errors/errors';
import { SeekerProfileMapper } from '../../mappers/seeker-profile.mapper';
import { ExperienceResponseDto } from '../../dto/seeker/seeker-profile-response.dto';

export class UpdateExperienceUseCase implements IUpdateExperienceUseCase {
  constructor(
    private readonly _seekerProfileRepository: ISeekerProfileRepository,
    private readonly _seekerExperienceRepository: ISeekerExperienceRepository,
  ) {}

  async execute(userId: string, experienceId: string, data: UpdateExperienceData): Promise<ExperienceResponseDto> {
    
    const profile = await this._seekerProfileRepository.findOne({ userId });
    if (!profile) {
      throw new NotFoundError('Seeker profile not found');
    }

    const existingExperience = await this._seekerExperienceRepository.findById(experienceId);
    
    if (!existingExperience) {
      throw new NotFoundError('Experience not found');
    }

    const userExperiences = await this._seekerExperienceRepository.findBySeekerProfileId(profile.id);
    if (!userExperiences.find(exp => exp.id === experienceId)) {
      throw new NotFoundError('Experience not found');
    }

    const mergedData: Partial<Experience> = {
      ...existingExperience,
      ...data,
    };

    const startDate = mergedData.startDate || existingExperience.startDate;
    if (mergedData.endDate && mergedData.endDate < startDate) {
      throw new ValidationError('End date must be after start date');
    }

    if (mergedData.isCurrent && mergedData.endDate) {
      throw new ValidationError('Current experience cannot have an end date');
    }

    const updatedExperience = await this._seekerExperienceRepository.update(experienceId, data);
    
    if (!updatedExperience) {
      throw new NotFoundError('Failed to update experience');
    }
    
    return SeekerProfileMapper.experienceToDto(updatedExperience);
  }
}


