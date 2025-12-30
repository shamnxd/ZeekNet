import { IGetCandidateDetailsUseCase, CandidateDetails } from '../../../domain/interfaces/use-cases/company/IGetCandidateDetailsUseCase';
import { SeekerProfile } from '../../../domain/entities/seeker-profile.entity';
import { ISeekerProfileRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { ISeekerExperienceRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerExperienceRepository';
import { ISeekerEducationRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerEducationRepository';
import { IUserRepository } from '../../../domain/interfaces/repositories/user/IUserRepository';
import { S3Service } from '../../../infrastructure/external-services/s3/s3.service';
import { NotFoundError } from '../../../domain/errors/errors';

export class GetCandidateDetailsUseCase implements IGetCandidateDetailsUseCase {
  constructor(
    private readonly seekerProfileRepository: ISeekerProfileRepository,
    private readonly seekerExperienceRepository: ISeekerExperienceRepository,
    private readonly seekerEducationRepository: ISeekerEducationRepository,
    private readonly userRepository: IUserRepository,
    private readonly s3Service: S3Service,
  ) {}

  async execute(candidateId: string): Promise<CandidateDetails> {
    if (!candidateId) {
      throw new NotFoundError('Candidate ID is required');
    }

    const profile = await this.seekerProfileRepository.findById(candidateId);
    if (!profile) {
      throw new NotFoundError('Candidate not found');
    }

    const userId = profile.userId;
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User data not found');
    }

    const experiences = await this.seekerExperienceRepository.findBySeekerProfileId(candidateId);
    const educations = await this.seekerEducationRepository.findBySeekerProfileId(candidateId);

    const profileData = { ...profile };
    
    try {
      if (profile.avatarFileName && !profile.avatarFileName.startsWith('http')) {
        profileData.avatarFileName = await this.s3Service.getSignedUrl(profile.avatarFileName);
      }
    } catch (error) {
      console.error('Error getting avatar signed URL:', error);
      // Keep original value if S3 call fails
    }

    try {
      if (profile.bannerFileName && !profile.bannerFileName.startsWith('http')) {
        profileData.bannerFileName = await this.s3Service.getSignedUrl(profile.bannerFileName);
      }
    } catch (error) {
      console.error('Error getting banner signed URL:', error);
      // Keep original value if S3 call fails
    }
    
    try {
      if (profile.resume?.url && !profile.resume.url.startsWith('http')) {
        const signedResumeUrl = await this.s3Service.getSignedUrl(profile.resume.url);
        profileData.resume = {
          ...profile.resume,
          url: signedResumeUrl,
        };
      }
    } catch (error) {
      console.error('Error getting resume signed URL:', error);
      // Keep original value if S3 call fails
    }

    return {
      profile: profileData as SeekerProfile,
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
      },
      experiences: experiences.sort((a, b) => {
        const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
        const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
        return dateB - dateA;
      }),
      educations: educations.sort((a, b) => {
        const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
        const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
        return dateB - dateA;
      }),
    };
  }
}
