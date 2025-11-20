import { ISeekerProfileRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { ISeekerEducationRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerEducationRepository';
import { IUpdateEducationUseCase, UpdateEducationData } from '../../../domain/interfaces/use-cases/ISeekerUseCases';
import { Education } from '../../../domain/entities/seeker-profile.entity';
import { NotFoundError, ValidationError } from '../../../domain/errors/errors';
import { SeekerProfileMapper } from '../../mappers/seeker-profile.mapper';
import { EducationResponseDto } from '../../dto/seeker/seeker-profile-response.dto';

export class UpdateEducationUseCase implements IUpdateEducationUseCase {
  constructor(
    private readonly _seekerProfileRepository: ISeekerProfileRepository,
    private readonly _seekerEducationRepository: ISeekerEducationRepository,
  ) {}

  async execute(userId: string, educationId: string, data: UpdateEducationData): Promise<EducationResponseDto> {
    
    const profile = await this._seekerProfileRepository.findOne({ userId });
    if (!profile) {
      throw new NotFoundError('Seeker profile not found');
    }

    const existingEducation = await this._seekerEducationRepository.findById(educationId);
    
    if (!existingEducation) {
      throw new NotFoundError('Education not found');
    }

    const userEducation = await this._seekerEducationRepository.findBySeekerProfileId(profile.id);
    if (!userEducation.find(edu => edu.id === educationId)) {
      throw new NotFoundError('Education not found');
    }

    const mergedData: Partial<Education> = {
      ...existingEducation,
      ...data,
    };

    const startDate = mergedData.startDate || existingEducation.startDate;
    if (mergedData.endDate && mergedData.endDate < startDate) {
      throw new ValidationError('End date must be after start date');
    }

    const updatedEducation = await this._seekerEducationRepository.update(educationId, data);
    return SeekerProfileMapper.educationToDto(updatedEducation);
  }
}


