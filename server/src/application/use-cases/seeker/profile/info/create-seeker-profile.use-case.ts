import { ISeekerProfileRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { ICreateSeekerProfileUseCase } from 'src/domain/interfaces/use-cases/seeker/profile/info/ICreateSeekerProfileUseCase';
import { IS3Service } from 'src/domain/interfaces/services/IS3Service';
import { ValidationError } from 'src/domain/errors/errors';
import { SeekerProfileMapper } from 'src/application/mappers/seeker/seeker-profile.mapper';
import { SeekerProfileResponseDto } from 'src/application/dtos/seeker/profile/info/responses/seeker-profile-response.dto';
import { CreateSeekerProfileRequestDto } from 'src/application/dtos/seeker/profile/info/requests/create-seeker-profile-request.dto';

import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';

@injectable()
export class CreateSeekerProfileUseCase implements ICreateSeekerProfileUseCase {
  constructor(
    @inject(TYPES.SeekerProfileRepository) private readonly _seekerProfileRepository: ISeekerProfileRepository,
    @inject(TYPES.S3Service) private readonly _s3Service: IS3Service,
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


