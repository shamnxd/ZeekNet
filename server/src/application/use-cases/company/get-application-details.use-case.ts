import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { IUserRepository } from '../../../domain/interfaces/repositories/user/IUserRepository';
import { ISeekerProfileRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { ISeekerExperienceRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerExperienceRepository';
import { ISeekerEducationRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerEducationRepository';
import { IS3Service } from '../../../domain/interfaces/services/IS3Service';
import { IGetApplicationDetailsUseCase } from '../../../domain/interfaces/use-cases/IJobApplicationUseCases';
import { NotFoundError, ValidationError } from '../../../domain/errors/errors';
import { JobApplicationMapper } from '../../mappers/job-application.mapper';
import { JobApplicationDetailResponseDto } from '../../dto/application/job-application-response.dto';

export class GetApplicationDetailsUseCase implements IGetApplicationDetailsUseCase {
  constructor(
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _seekerProfileRepository: ISeekerProfileRepository,
    private readonly _seekerExperienceRepository: ISeekerExperienceRepository,
    private readonly _seekerEducationRepository: ISeekerEducationRepository,
    private readonly _s3Service: IS3Service,
  ) {}

  async execute(userId: string, applicationId: string): Promise<JobApplicationDetailResponseDto> {
    const companyProfile = await this._companyProfileRepository.findOne({ userId });
    if (!companyProfile) {
      throw new NotFoundError('Company profile not found');
    }

    const application = await this._jobApplicationRepository.findById(applicationId);
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    const job = await this._jobPostingRepository.findById(application.jobId);
    if (!job) {
      throw new NotFoundError('Job posting not found');
    }
    if (job.companyId !== companyProfile.id) {
      throw new ValidationError('You can only view applications for your own job postings');
    }

    const [user, profile] = await Promise.all([
      this._userRepository.findById(application.seekerId),
      this._seekerProfileRepository.findOne({ userId: application.seekerId }),
    ]);

    let experiences: Array<{ title: string; company: string; startDate: Date; endDate?: Date; location?: string; description?: string; }> = [];
    let education: Array<{ school: string; degree?: string; startDate: Date; endDate?: Date; location?: string; }> = [];
    if (profile) {
      const [exps, edus] = await Promise.all([
        this._seekerExperienceRepository.findBySeekerProfileId(profile.id),
        this._seekerEducationRepository.findBySeekerProfileId(profile.id),
      ]);
      experiences = exps.map((e) => ({
        title: e.title,
        company: e.company,
        startDate: e.startDate,
        endDate: e.endDate,
        location: e.location,
        description: e.description,
      }));
      education = edus.map((d) => ({
        school: d.school,
        degree: d.degree,
        startDate: d.startDate,
        endDate: d.endDate,
        location: undefined,
      }));
    }

    const [avatarUrl, resumeUrl] = await Promise.all([
      profile?.avatarFileName ? this._s3Service.getSignedUrl(profile.avatarFileName) : Promise.resolve(undefined),
      application.resumeUrl && !application.resumeUrl.startsWith('http') 
        ? this._s3Service.getSignedUrl(application.resumeUrl) 
        : Promise.resolve(application.resumeUrl),
    ]);

    return JobApplicationMapper.toDetailResponse(
      application,
      {
        name: user?.name,
        avatar: avatarUrl,
        headline: profile?.headline || undefined,
        email: profile?.email || undefined,
        phone: profile?.phone || undefined,
        location: profile?.location || undefined,
        summary: profile?.summary || undefined,
        skills: profile?.skills || undefined,
        languages: profile?.languages || undefined,
        date_of_birth: profile?.dateOfBirth || undefined,
        gender: profile?.gender || undefined,
        experiences,
        education,
      },
      {
        title: job?.title,
        companyName: job?.companyName,
        companyLogo: job?.companyLogo,
        location: job?.location,
        employmentTypes: job?.employmentTypes,
      },
      resumeUrl,
    );
  }
}


