import { ISeekerProfileRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { IUpdateSeekerProfileUseCase } from '../../../domain/interfaces/use-cases/seeker/IUpdateSeekerProfileUseCase';
import { IS3Service } from '../../../domain/interfaces/services/IS3Service';
import { SeekerProfile } from '../../../domain/entities/seeker-profile.entity';
import { NotFoundError } from '../../../domain/errors/errors';
import { SeekerProfileMapper } from '../../mappers/seeker-profile.mapper';
import { SeekerProfileResponseDto } from '../../dto/seeker/seeker-profile-response.dto';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { UpdateSeekerProfileRequestDto } from '../../dto/seeker/update-seeker-profile-request.dto';

export class UpdateSeekerProfileUseCase implements IUpdateSeekerProfileUseCase {
  constructor(
    private readonly _seekerProfileRepository: ISeekerProfileRepository,
    private readonly _s3Service: IS3Service,
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(dto: UpdateSeekerProfileRequestDto): Promise<SeekerProfileResponseDto> {
    const { userId } = dto;
    const existingProfile = await this._seekerProfileRepository.findOne({ userId });
    
    if (!existingProfile) {
      throw new NotFoundError('Seeker profile not found');
    }

    if (dto.name !== undefined) {
      const user = await this._userRepository.findById(userId);
      if (user) {
        await this._userRepository.update(userId, { name: dto.name });
      }
    }

    const updateData: Record<string, unknown> = {};
    
    if (dto.headline !== undefined) updateData.headline = dto.headline || null;
    if (dto.summary !== undefined) updateData.summary = dto.summary || null;
    if (dto.location !== undefined) updateData.location = dto.location || null;
    if (dto.phone !== undefined) updateData.phone = dto.phone || null;
    if (dto.email !== undefined) updateData.email = dto.email;
    if (dto.dateOfBirth !== undefined) updateData.dateOfBirth = dto.dateOfBirth ? new Date(dto.dateOfBirth) : null;
    if (dto.gender !== undefined) updateData.gender = dto.gender || null;
    if (dto.skills !== undefined) updateData.skills = dto.skills;
    if (dto.languages !== undefined) updateData.languages = dto.languages || [];
    if (dto.socialLinks !== undefined) updateData.socialLinks = dto.socialLinks || [];

    const updatedProfile = await this._seekerProfileRepository.update(existingProfile.id, updateData as Partial<SeekerProfile>);
    
    if (!updatedProfile) {
      throw new NotFoundError('Failed to update seeker profile');
    }
    
    return SeekerProfileMapper.toResponse(updatedProfile, this._s3Service);
  }
}


