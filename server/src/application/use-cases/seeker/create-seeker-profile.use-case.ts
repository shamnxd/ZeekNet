import { ISeekerProfileRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { ICreateSeekerProfileUseCase, CreateSeekerProfileData } from '../../../domain/interfaces/use-cases/ISeekerUseCases';
import { IS3Service } from '../../../domain/interfaces/services/IS3Service';
import { ValidationError } from '../../../domain/errors/errors';
import { SeekerProfileMapper } from '../../mappers/seeker-profile.mapper';
import { SeekerProfileResponseDto } from '../../dto/seeker/seeker-profile-response.dto';

export class CreateSeekerProfileUseCase implements ICreateSeekerProfileUseCase {
  constructor(
    private readonly _seekerProfileRepository: ISeekerProfileRepository,
    private readonly _s3Service: IS3Service,
  ) {}

  async execute(userId: string, data: CreateSeekerProfileData): Promise<SeekerProfileResponseDto> {

    const existingProfile = await this._seekerProfileRepository.findOne({ userId });
    if (existingProfile) {
      throw new ValidationError('Profile already exists. Use update endpoint to modify.');
    }

    const profile = await this._seekerProfileRepository.create({
      userId,
      headline: data.headline ?? null,
      summary: data.summary ?? null,
      location: data.location ?? null,
      phone: data.phone ?? null,
      email: data.email ?? null,

      avatarFileName: data.avatarFileName ?? null,
      bannerFileName: data.bannerFileName ?? null,
      dateOfBirth: data.dateOfBirth ?? null,
      gender: data.gender ?? null,

      resume: null,
      skills: data.skills ?? [],
      languages: data.languages ?? [],
      socialLinks: data.socialLinks ?? [],
    });

    return SeekerProfileMapper.toDto(profile, this._s3Service);
  }
}
