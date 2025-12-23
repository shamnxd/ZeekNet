import { IGetCandidatesUseCase } from '../../../domain/interfaces/use-cases/company/IGetCandidatesUseCase';
import { ISeekerProfileRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { IS3Service } from '../../../domain/interfaces/services/IS3Service';

export class GetCandidatesUseCase implements IGetCandidatesUseCase {
  constructor(
    private readonly _seekerProfileRepository: ISeekerProfileRepository,
    private readonly _s3Service: IS3Service,
  ) {}

  async execute(options: {
    page: number;
    limit: number;
    search?: string;
    skills?: string[];
    location?: string;
  }) {
    const result = await this._seekerProfileRepository.getAll(options);
    
    const candidates = await Promise.all(result.seekers.map(async (seeker) => {
      let avatar = seeker.avatarFileName;
      if (avatar && !avatar.startsWith('http')) {
        avatar = await this._s3Service.getSignedUrl(avatar);
      }
      return {
        id: seeker.id,
        userId: seeker.userId,
        name: seeker.user.name,
        email: seeker.user.email,
        headline: seeker.headline,
        summary: seeker.summary,
        location: seeker.location,
        skills: seeker.skills,
        avatar,
      };
    }));
    
    return {
      candidates,
      total: result.total,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil(result.total / options.limit),
    };
  }
}
