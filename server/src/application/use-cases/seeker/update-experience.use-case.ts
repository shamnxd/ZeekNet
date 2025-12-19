import { ISeekerProfileRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { ISeekerExperienceRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerExperienceRepository';
import { IUpdateExperienceUseCase } from '../../../domain/interfaces/use-cases/seeker/IUpdateExperienceUseCase';
import { Experience } from '../../../domain/entities/seeker-profile.entity';
import { NotFoundError, ValidationError } from '../../../domain/errors/errors';
import { SeekerProfileMapper } from '../../mappers/seeker-profile.mapper';
import { ExperienceResponseDto } from '../../dto/seeker/seeker-profile-response.dto';
import { UpdateExperienceRequestDto } from '../../dto/seeker/update-experience-request.dto';

export class UpdateExperienceUseCase implements IUpdateExperienceUseCase {
  constructor(
    private readonly _seekerProfileRepository: ISeekerProfileRepository,
    private readonly _seekerExperienceRepository: ISeekerExperienceRepository,
  ) {}

  async execute(dto: UpdateExperienceRequestDto): Promise<ExperienceResponseDto> {
    const { userId, experienceId } = dto;
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

    const updateData = SeekerProfileMapper.toExperienceUpdateEntity(dto);

    const startDate = updateData.startDate || existingExperience.startDate;
    const endDate = updateData.endDate !== undefined ? updateData.endDate : existingExperience.endDate;
    const isCurrent = updateData.isCurrent !== undefined ? updateData.isCurrent : existingExperience.isCurrent;

    if (endDate && endDate < startDate) {
      throw new ValidationError('End date must be after start date');
    }

    if (isCurrent && endDate) {
      throw new ValidationError('Current experience cannot have an end date');
    }

    const updatedExperience = await this._seekerExperienceRepository.update(experienceId, updateData);
    
    if (!updatedExperience) {
      throw new NotFoundError('Failed to update experience');
    }
    
    return SeekerProfileMapper.experienceToResponse(updatedExperience);
  }
}


