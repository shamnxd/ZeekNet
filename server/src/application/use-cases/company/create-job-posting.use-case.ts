import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { ICompanySubscriptionRepository } from '../../../domain/interfaces/repositories/subscription/ICompanySubscriptionRepository';
import { CreateJobPostingData } from 'src/domain/interfaces/use-cases/jobs/CreateJobPostingData';
import { AppError, ValidationError } from '../../../domain/errors/errors';
import { JobPosting } from '../../../domain/entities/job-posting.entity';
import { ICreateJobPostingUseCase } from 'src/domain/interfaces/use-cases/jobs/ICreateJobPostingUseCase';
import { IGetCompanyProfileByUserIdUseCase } from 'src/domain/interfaces/use-cases/company/IGetCompanyProfileByUserIdUseCase';

export class CreateJobPostingUseCase implements ICreateJobPostingUseCase {
  constructor(
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _getCompanyProfileByUserIdUseCase: IGetCompanyProfileByUserIdUseCase,
    private readonly _companySubscriptionRepository: ICompanySubscriptionRepository,
  ) {}

  async execute(data: CreateJobPostingData): Promise<JobPosting> {
    const { userId, ...jobData } = data;
    if (!userId) throw new Error('User ID is required');
    const companyProfile = await this._getCompanyProfileByUserIdUseCase.execute(userId);
    if (!companyProfile) {
      throw new AppError('Company profile not found', 404);
    }

    const subscription = await this._companySubscriptionRepository.findActiveByCompanyId(companyProfile.id);
    if (!subscription) {
      throw new ValidationError('No active subscription found. Please subscribe to a plan to post jobs.');
    }

    if (subscription.isExpired()) {
      throw new ValidationError('Your subscription has expired. Please renew to continue posting jobs.');
    }

    if (!subscription.canPostJob()) {
      throw new ValidationError(`You have reached your active job limit of ${subscription.jobPostLimit} jobs. Please upgrade your plan or unlist other jobs.`);
    }

    const isFeatured = jobData.is_featured || false;
    if (isFeatured && !subscription.canPostFeaturedJob()) {
      throw new ValidationError(`You have reached your active featured job limit of ${subscription.featuredJobLimit} jobs. Please upgrade your plan or unlist other featured jobs.`);
    }
    
    const jobPosting: Omit<JobPosting, 'id' | '_id' | 'createdAt' | 'updatedAt'> = {
      companyId: companyProfile.id,
      title: jobData.title,
      description: jobData.description,
      responsibilities: jobData.responsibilities,
      qualifications: jobData.qualifications,
      niceToHaves: jobData.nice_to_haves || [],
      benefits: jobData.benefits || [],
      salary: jobData.salary,
      employmentTypes: jobData.employment_types,
      location: jobData.location,
      skillsRequired: jobData.skills_required || [],
      categoryIds: jobData.category_ids || [],
      status: 'active',
      isFeatured,
      viewCount: 0,
      applicationCount: 0,
    };

    const createdJob = await this._jobPostingRepository.postJob(jobPosting);

    await this._companySubscriptionRepository.incrementJobPostsUsed(subscription.id);
    if (isFeatured) {
      await this._companySubscriptionRepository.incrementFeaturedJobsUsed(subscription.id);
    }

    return createdJob;
  }
}

