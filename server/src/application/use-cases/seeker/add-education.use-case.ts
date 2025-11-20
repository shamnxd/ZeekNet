import { ISeekerProfileRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { ISeekerEducationRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerEducationRepository';
import { IAddEducationUseCase, AddEducationData } from '../../../domain/interfaces/use-cases/ISeekerUseCases';
import { NotFoundError, ValidationError } from '../../../domain/errors/errors';
import { SeekerProfileMapper } from '../../mappers/seeker-profile.mapper';
import { EducationResponseDto } from '../../dto/seeker/seeker-profile-response.dto';

export class AddEducationUseCase implements IAddEducationUseCase {
  constructor(
    private readonly _seekerProfileRepository: ISeekerProfileRepository,
    private readonly _seekerEducationRepository: ISeekerEducationRepository,
  ) {}

  async execute(userId: string, data: AddEducationData): Promise<EducationResponseDto> {
    
    const profile = await this._seekerProfileRepository.findOne({ userId });
    if (!profile) {
      throw new NotFoundError('Seeker profile not found');
    }

    if (data.endDate && data.endDate < data.startDate) {
      throw new ValidationError('End date must be after start date');
    }

    const education = await this._seekerEducationRepository.createForProfile(profile.id, {
      school: data.school,
      degree: data.degree,
      fieldOfStudy: data.fieldOfStudy,
      startDate: data.startDate,
      endDate: data.endDate,
      grade: data.grade,
    });

    return SeekerProfileMapper.educationToDto(education);
  }
}


