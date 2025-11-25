import { ISeekerProfileRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { ISeekerExperienceRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerExperienceRepository';
import { ISeekerEducationRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerEducationRepository';
import { IUserRepository } from '../../../domain/interfaces/repositories/user/IUserRepository';
import { IGetSeekerProfileUseCase } from '../../../domain/interfaces/use-cases/ISeekerUseCases';
import { IS3Service } from '../../../domain/interfaces/services/IS3Service';
import { NotFoundError } from '../../../domain/errors/errors';
import { SeekerProfileMapper } from '../../mappers/seeker-profile.mapper';
import { SeekerProfileResponseDto } from '../../dto/seeker/seeker-profile-response.dto';

export class GetSeekerProfileUseCase implements IGetSeekerProfileUseCase {
  constructor(
    private readonly _seekerProfileRepository: ISeekerProfileRepository,
    private readonly _seekerExperienceRepository: ISeekerExperienceRepository,
    private readonly _seekerEducationRepository: ISeekerEducationRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _s3Service: IS3Service,
  ) {}

  async execute(userId: string): Promise<SeekerProfileResponseDto> {
    
    const user = await this._userRepository.findById(userId);
    
    if (!user) {
      throw new NotFoundError('User not found');
    }

    let profile = await this._seekerProfileRepository.findOne({ userId });

    if (!profile) {
      profile = await this._seekerProfileRepository.create({
        userId,
        headline: null,
        summary: null,
        location: null,
        phone: null,
        email: null,
        avatarFileName: null,
        bannerFileName: null,
        dateOfBirth: null,
        gender: null,
        skills: [],
        languages: [],
        socialLinks: [],
        resume: null,
      });
    }

    const [experiences, education] = await Promise.all([
      this._seekerExperienceRepository.findBySeekerProfileId(profile.id),
      this._seekerEducationRepository.findBySeekerProfileId(profile.id),
    ]);

    const profileDto = SeekerProfileMapper.toResponse(profile, this._s3Service);
    
    return {
      ...profileDto,
      name: user.name || '', 
      experiences: experiences.map(exp => SeekerProfileMapper.experienceToResponse(exp)),
      education: education.map(edu => SeekerProfileMapper.educationToResponse(edu)),
    };
  }
}


