import { ISeekerProfileRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { ICreateSeekerProfileUseCase } from '../../../domain/interfaces/use-cases/ISeekerUseCases';
import { IS3Service } from '../../../domain/interfaces/services/IS3Service';
import { ValidationError } from '../../../domain/errors/errors';
import { SeekerProfileMapper } from '../../mappers/seeker-profile.mapper';
import { SeekerProfileResponseDto } from '../../dto/seeker/seeker-profile-response.dto';
import { CreateSeekerProfileRequestDto } from '../../dto/seeker/seeker-profile.dto';

export class CreateSeekerProfileUseCase implements ICreateSeekerProfileUseCase {
  constructor(
    private readonly _seekerProfileRepository: ISeekerProfileRepository,
    private readonly _s3Service: IS3Service,
  ) {}

  async execute(userId: string, dto: CreateSeekerProfileRequestDto): Promise<SeekerProfileResponseDto> {
    const existingProfile = await this._seekerProfileRepository.findOne({ userId });
    if (existingProfile) {
      throw new ValidationError('Profile already exists. Use update endpoint to modify.');
    }

    // DTO -> Domain mapping (inline in use case)
    const profile = await this._seekerProfileRepository.create({
      userId,
      headline: dto.headline ?? null,
      summary: dto.summary ?? null,
      location: dto.location ?? null,
      phone: dto.phone ?? null,
      email: dto.email ?? null,
      avatarFileName: null,
      bannerFileName: null,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
      gender: dto.gender ?? null,
      resume: null,
      skills: dto.skills ?? [],
      languages: dto.languages ?? [],
      socialLinks: dto.socialLinks ?? [],
    });

    // Entity -> DTO mapping
    return SeekerProfileMapper.toResponse(profile, this._s3Service);
  }
}
