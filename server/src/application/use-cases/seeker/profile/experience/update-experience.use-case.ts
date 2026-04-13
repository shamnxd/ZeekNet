import { ISeekerProfileRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { ISeekerExperienceRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerExperienceRepository';
import { IUpdateExperienceUseCase } from 'src/domain/interfaces/use-cases/seeker/profile/experience/IUpdateExperienceUseCase';
import { Experience } from 'src/domain/entities/seeker-profile.entity';
import { NotFoundError, ValidationError } from 'src/domain/errors/errors';
import { SeekerProfileMapper } from 'src/application/mappers/seeker/seeker-profile.mapper';
import { ExperienceResponseDto } from 'src/application/dtos/seeker/profile/info/responses/seeker-profile-response.dto';
import { UpdateExperienceRequestDto } from 'src/application/dtos/seeker/profile/experience/requests/update-experience-request.dto';

import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ERROR } from 'src/shared/constants/messages';


@injectable()
export class UpdateExperienceUseCase implements IUpdateExperienceUseCase {
  constructor(
    @inject(TYPES.SeekerProfileRepository) private readonly _seekerProfileRepository: ISeekerProfileRepository,
    @inject(TYPES.SeekerExperienceRepository) private readonly _seekerExperienceRepository: ISeekerExperienceRepository,
  ) {}

  async execute(dto: UpdateExperienceRequestDto): Promise<ExperienceResponseDto> {
    const { userId, experienceId } = dto;
    const profile = await this._seekerProfileRepository.findOne({ userId });
    if (!profile) {
      throw new NotFoundError(ERROR.NOT_FOUND('Seeker profile'));
    }

    const existingExperience = await this._seekerExperienceRepository.findById(experienceId);
    
    if (!existingExperience) {
      throw new NotFoundError(ERROR.NOT_FOUND('Experience'));
    }

    const userExperiences = await this._seekerExperienceRepository.findBySeekerProfileId(profile.id);
    if (!userExperiences.find(exp => exp.id === experienceId)) {
      throw new NotFoundError(ERROR.NOT_FOUND('Experience'));
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
      throw new NotFoundError(ERROR.FAILED_TO('update experience'));
    }
    
    return SeekerProfileMapper.experienceToResponse(updatedExperience);
  }
}




