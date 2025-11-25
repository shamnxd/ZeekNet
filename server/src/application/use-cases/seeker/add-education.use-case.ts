import { ISeekerProfileRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { ISeekerEducationRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerEducationRepository';
import { IAddEducationUseCase } from '../../../domain/interfaces/use-cases/ISeekerUseCases';
import { NotFoundError, ValidationError } from '../../../domain/errors/errors';
import { SeekerProfileMapper } from '../../mappers/seeker-profile.mapper';
import { EducationResponseDto } from '../../dto/seeker/seeker-profile-response.dto';
import { AddEducationRequestDto } from '../../dto/seeker/seeker-profile.dto';

export class AddEducationUseCase implements IAddEducationUseCase {
  constructor(
    private readonly _seekerProfileRepository: ISeekerProfileRepository,
    private readonly _seekerEducationRepository: ISeekerEducationRepository,
  ) {}

  async execute(userId: string, dto: AddEducationRequestDto): Promise<EducationResponseDto> {
    // DTO -> Domain mapping (inline in use case)
    const startDate = new Date(dto.startDate);
    const endDate = dto.endDate ? new Date(dto.endDate) : undefined;
    
    // Validation
    if (!dto.school || !dto.startDate) {
      throw new ValidationError('Missing required fields: school and startDate are required');
    }
    
    const profile = await this._seekerProfileRepository.findOne({ userId });
    if (!profile) {
      throw new NotFoundError('Seeker profile not found');
    }

    if (endDate && endDate < startDate) {
      throw new ValidationError('End date must be after start date');
    }

    const education = await this._seekerEducationRepository.createForProfile(profile.id, {
      school: dto.school,
      degree: dto.degree,
      fieldOfStudy: dto.fieldOfStudy,
      startDate,
      endDate,
      grade: dto.grade,
    });

    return SeekerProfileMapper.educationToResponse(education);
  }
}


