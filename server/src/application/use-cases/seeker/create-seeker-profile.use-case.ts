import { ISeekerProfileRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { ICreateSeekerProfileUseCase } from '../../../domain/interfaces/use-cases/seeker/ICreateSeekerProfileUseCase';
import { IS3Service } from '../../../domain/interfaces/services/IS3Service';
import { ValidationError } from '../../../domain/errors/errors';
import { SeekerProfileMapper } from '../../mappers/seeker-profile.mapper';
import { SeekerProfileResponseDto } from '../../dto/seeker/seeker-profile-response.dto';
import { CreateSeekerProfileRequestDto } from '../../dto/seeker/create-seeker-profile-request.dto';

export class CreateSeekerProfileUseCase implements ICreateSeekerProfileUseCase {
  constructor(
    private readonly _seekerProfileRepository: ISeekerProfileRepository,
    private readonly _s3Service: IS3Service,
  ) {}

  async execute(dto: CreateSeekerProfileRequestDto): Promise<SeekerProfileResponseDto> {
    const { userId } = dto;
    const existingProfile = await this._seekerProfileRepository.findOne({ userId });
    if (existingProfile) {
      throw new ValidationError('Profile already exists. Use update endpoint to modify.');
    }

    const profile = await this._seekerProfileRepository.create(
      SeekerProfileMapper.toEntity({
        userId,
        headline: dto.headline,
        summary: dto.summary,
        location: dto.location,
        phone: dto.phone,
        email: dto.email,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
        gender: dto.gender,
        skills: dto.skills,
        languages: dto.languages,
        socialLinks: dto.socialLinks,
      }),
    );

    return SeekerProfileMapper.toResponse(profile, this._s3Service);
  }
}
