import { ISeekerProfileRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { ISeekerEducationRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerEducationRepository';
import { Education } from 'src/domain/entities/seeker-profile.entity';
import { NotFoundError, ValidationError } from 'src/domain/errors/errors';
import { SeekerProfileMapper } from 'src/application/mappers/seeker/seeker-profile.mapper';
import { EducationResponseDto } from 'src/application/dtos/seeker/profile/info/responses/seeker-profile-response.dto';
import { UpdateEducationRequestDto } from 'src/application/dtos/seeker/profile/education/requests/update-education-request.dto';
import { IUpdateEducationUseCase } from 'src/domain/interfaces/use-cases/seeker/profile/education/IUpdateEducationUseCase';

export class UpdateEducationUseCase implements IUpdateEducationUseCase {
  constructor(
    private readonly _seekerProfileRepository: ISeekerProfileRepository,
    private readonly _seekerEducationRepository: ISeekerEducationRepository,
  ) {}

  async execute(dto: UpdateEducationRequestDto): Promise<EducationResponseDto> {
    const { userId, educationId } = dto;
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

    const updateData = SeekerProfileMapper.toEducationUpdateEntity(dto);

    const startDate = updateData.startDate || existingEducation.startDate;
    if (updateData.endDate && updateData.endDate < startDate) {
      throw new ValidationError('End date must be after start date');
    }

    const updatedEducation = await this._seekerEducationRepository.update(educationId, updateData);
    
    if (!updatedEducation) {
      throw new NotFoundError('Failed to update education');
    }
    
    return SeekerProfileMapper.educationToResponse(updatedEducation);
  }
}




