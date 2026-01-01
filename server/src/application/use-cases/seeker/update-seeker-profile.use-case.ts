import { ISeekerProfileRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { IUpdateSeekerProfileUseCase } from '../../../domain/interfaces/use-cases/seeker/IUpdateSeekerProfileUseCase';
import { IS3Service } from '../../../domain/interfaces/services/IS3Service';
import { SeekerProfile } from '../../../domain/entities/seeker-profile.entity';
import { NotFoundError } from '../../../domain/errors/errors';
import { SeekerProfileMapper } from '../../mappers/seeker/seeker-profile.mapper';
import { SeekerProfileResponseDto } from '../../dtos/seeker/responses/seeker-profile-response.dto';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { UpdateSeekerProfileRequestDto } from '../../dtos/seeker/requests/update-seeker-profile-request.dto';

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

    const updateData = SeekerProfileMapper.toUpdateEntity(dto);

    const updatedProfile = await this._seekerProfileRepository.update(existingProfile.id, updateData);
    
    if (!updatedProfile) {
      throw new NotFoundError('Failed to update seeker profile');
    }
    
    return SeekerProfileMapper.toResponse(updatedProfile, this._s3Service);
  }
}




