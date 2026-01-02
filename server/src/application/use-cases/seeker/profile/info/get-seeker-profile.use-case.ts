import { ISeekerProfileRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { ISeekerExperienceRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerExperienceRepository';
import { ISeekerEducationRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerEducationRepository';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { IGetSeekerProfileUseCase } from 'src/domain/interfaces/use-cases/seeker/profile/info/IGetSeekerProfileUseCase';
import { IS3Service } from 'src/domain/interfaces/services/IS3Service';
import { NotFoundError } from 'src/domain/errors/errors';
import { SeekerProfileMapper } from 'src/application/mappers/seeker/seeker-profile.mapper';
import { SeekerProfileResponseDto } from 'src/application/dtos/seeker/profile/info/responses/seeker-profile-response.dto';

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
      profile = await this._seekerProfileRepository.create(
        SeekerProfileMapper.toEntity({ userId }),
      );
    }

    const [experiences, education] = await Promise.all([
      this._seekerExperienceRepository.findBySeekerProfileId(profile.id),
      this._seekerEducationRepository.findBySeekerProfileId(profile.id),
    ]);

    const [avatarUrl, bannerUrl, resumeUrl] = await Promise.all([
      profile.avatarFileName ? this._s3Service.getSignedUrl(profile.avatarFileName) : Promise.resolve(null),
      profile.bannerFileName ? this._s3Service.getSignedUrl(profile.bannerFileName) : Promise.resolve(null),
      profile.resume?.url ? (profile.resume.url.includes('/') && !profile.resume.url.startsWith('http') 
        ? this._s3Service.getSignedUrl(profile.resume.url) 
        : Promise.resolve(profile.resume.url)) : Promise.resolve(null),
    ]);

    const profileDto = SeekerProfileMapper.toResponse(profile, this._s3Service, { avatarUrl, bannerUrl, resumeUrl });
    
    return {
      ...profileDto,
      name: user.name || '', 
      experiences: experiences.map(exp => SeekerProfileMapper.experienceToResponse(exp)),
      education: education.map(edu => SeekerProfileMapper.educationToResponse(edu)),
    };
  }
}




