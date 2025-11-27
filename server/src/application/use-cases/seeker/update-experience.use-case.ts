import { ISeekerProfileRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { ISeekerExperienceRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerExperienceRepository';
import { IUpdateExperienceUseCase } from '../../../domain/interfaces/use-cases/ISeekerUseCases';
import { Experience } from '../../../domain/entities/seeker-profile.entity';
import { NotFoundError, ValidationError } from '../../../domain/errors/errors';
import { SeekerProfileMapper } from '../../mappers/seeker-profile.mapper';
import { ExperienceResponseDto } from '../../dto/seeker/seeker-profile-response.dto';
import { UpdateExperienceRequestDto } from '../../dto/seeker/seeker-profile.dto';

export class UpdateExperienceUseCase implements IUpdateExperienceUseCase {
  constructor(
    private readonly _seekerProfileRepository: ISeekerProfileRepository,
    private readonly _seekerExperienceRepository: ISeekerExperienceRepository,
  ) {}

  async execute(userId: string, experienceId: string, dto: UpdateExperienceRequestDto): Promise<ExperienceResponseDto> {
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

    const updateData: Partial<Experience> = {};
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.company !== undefined) updateData.company = dto.company;
    if (dto.startDate !== undefined) updateData.startDate = new Date(dto.startDate);
    if (dto.endDate !== undefined) updateData.endDate = dto.endDate ? new Date(dto.endDate) : undefined;
    if (dto.employmentType !== undefined) updateData.employmentType = dto.employmentType;
    if (dto.location !== undefined) updateData.location = dto.location;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.technologies !== undefined) updateData.technologies = dto.technologies;
    if (dto.isCurrent !== undefined) updateData.isCurrent = dto.isCurrent;

    const mergedData: Partial<Experience> = {
      ...existingExperience,
      ...updateData,
    };

    const startDate = mergedData.startDate || existingExperience.startDate;
    if (mergedData.endDate && mergedData.endDate < startDate) {
      throw new ValidationError('End date must be after start date');
    }

    if (mergedData.isCurrent && mergedData.endDate) {
      throw new ValidationError('Current experience cannot have an end date');
    }

    const updatedExperience = await this._seekerExperienceRepository.update(experienceId, updateData);
    
    if (!updatedExperience) {
      throw new NotFoundError('Failed to update experience');
    }
    
    return SeekerProfileMapper.experienceToResponse(updatedExperience);
  }
}


