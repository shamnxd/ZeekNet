import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { ICompanySubscriptionRepository } from '../../../domain/interfaces/repositories/subscription/ICompanySubscriptionRepository';
import { CreateJobPostingData, ICreateJobPostingUseCase, IGetCompanyProfileByUserIdUseCase } from '../../../domain/interfaces/use-cases/ICompanyUseCases';
import { AppError, ValidationError } from '../../../domain/errors/errors';
import { JobPosting } from '../../../domain/entities/job-posting.entity';

export class CreateJobPostingUseCase implements ICreateJobPostingUseCase {
  constructor(
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _getCompanyProfileByUserIdUseCase: IGetCompanyProfileByUserIdUseCase,
    private readonly _companySubscriptionRepository: ICompanySubscriptionRepository,
  ) {}

  async execute(userId: string, jobData: CreateJobPostingData): Promise<JobPosting> {
    const companyProfile = await this._getCompanyProfileByUserIdUseCase.execute(userId);
    if (!companyProfile) {
      throw new AppError('Company profile not found', 404);
    }
    
    // Check subscription
    const subscription = await this._companySubscriptionRepository.findActiveByCompanyId(companyProfile.id);
    if (!subscription) {
      throw new ValidationError('No active subscription found. Please subscribe to a plan to post jobs.');
    }

    if (subscription.isExpired()) {
      throw new ValidationError('Your subscription has expired. Please renew to continue posting jobs.');
    }

    // Check job posting limit
    if (!subscription.canPostJob()) {
      throw new ValidationError(`You have reached your job posting limit of ${subscription.jobPostLimit} jobs. Please upgrade your plan.`);
    }

    // Check featured job limit if this is a featured job
    const isFeatured = jobData.is_featured || false;
    if (isFeatured && !subscription.canPostFeaturedJob()) {
      throw new ValidationError(`You have reached your featured job limit of ${subscription.featuredJobLimit} featured jobs. Please upgrade your plan.`);
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

    // Increment usage counters
    await this._companySubscriptionRepository.incrementJobPostsUsed(subscription.id);
    if (isFeatured) {
      await this._companySubscriptionRepository.incrementFeaturedJobsUsed(subscription.id);
    }

    return createdJob;
  }
}

