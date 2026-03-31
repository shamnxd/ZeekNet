import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { ICompanySubscriptionRepository } from 'src/domain/interfaces/repositories/subscription/ICompanySubscriptionRepository';
import { ISubscriptionPlanRepository } from 'src/domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';
import { CreateJobPostingRequestDto } from 'src/application/dtos/admin/job/requests/create-job-posting-request.dto';
import { NotFoundError, ValidationError } from 'src/domain/errors/errors';
import { ICreateJobPostingUseCase } from 'src/domain/interfaces/use-cases/job/ICreateJobPostingUseCase';
import { IGetCompanyProfileByUserIdUseCase } from 'src/domain/interfaces/use-cases/company/profile/info/IGetCompanyProfileByUserIdUseCase';
import { JobPostingMapper } from 'src/application/mappers/job/job-posting.mapper';
import { Types } from 'mongoose';
import { JobPostingResponseDto } from 'src/application/dtos/admin/job/responses/job-posting-response.dto';
import { CompanySubscription } from 'src/domain/entities/company-subscription.entity';

export class CreateJobPostingUseCase implements ICreateJobPostingUseCase {
  constructor(
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _getCompanyProfileByUserIdUseCase: IGetCompanyProfileByUserIdUseCase,
    private readonly _companySubscriptionRepository: ICompanySubscriptionRepository,
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
  ) { }

  async execute(data: CreateJobPostingRequestDto): Promise<JobPostingResponseDto> {
    const { userId, ...jobData } = data;
    if (!userId) throw new Error('User ID is required');
    const companyProfile = await this._getCompanyProfileByUserIdUseCase.execute(userId);
    if (!companyProfile) {
      throw new NotFoundError('Company profile not found');
    }

    let subscription = await this._companySubscriptionRepository.findActiveByCompanyId(companyProfile.id);

    if (!subscription || (subscription && subscription.isExpired() && !subscription.isDefault)) {
      const defaultPlan = await this._subscriptionPlanRepository.findDefault();
      if (defaultPlan) {
        if (subscription && subscription.isExpired()) {
          await this._companySubscriptionRepository.update(subscription.id, {
            planId: defaultPlan.id,
            startDate: null,
            expiryDate: null,
            isActive: true,
          });
        }
        subscription = CompanySubscription.create({
          id: subscription?.id || '',
          companyId: companyProfile.id,
          planId: defaultPlan.id,
          startDate: null,
          expiryDate: null,
          isActive: true,
          jobPostsUsed: subscription?.jobPostsUsed || 0,
          featuredJobsUsed: subscription?.featuredJobsUsed || 0,
          applicantAccessUsed: subscription?.applicantAccessUsed || 0,
          planName: defaultPlan.name,
          jobPostLimit: defaultPlan.jobPostLimit,
          featuredJobLimit: defaultPlan.featuredJobLimit,
          applicantAccessLimit: defaultPlan.applicantAccessLimit,
          isDefault: true,
        });
      } else {
        throw new ValidationError('No active subscription found. Please subscribe to a plan to post jobs.');
      }
    }

    if (!subscription.canPostJob()) {
      throw new ValidationError(`You have reached your active job limit of ${subscription.jobPostLimit} jobs. Please upgrade your plan or unlist other jobs.`);
    }

    const isFeatured = jobData.is_featured || false;
    if (isFeatured && !subscription.canPostFeaturedJob()) {
      throw new ValidationError(`You have reached your active featured job limit of ${subscription.featuredJobLimit} jobs. Please upgrade your plan or unlist other featured jobs.`);
    }

    const id = new Types.ObjectId().toString();

    const jobPosting = JobPostingMapper.toDomain({
      id,
      companyId: companyProfile.id,
      title: jobData.title,
      description: jobData.description,
      responsibilities: jobData.responsibilities,
      qualifications: jobData.qualifications,
      niceToHaves: jobData.nice_to_haves,
      benefits: jobData.benefits,
      salary: jobData.salary,
      employmentTypes: jobData.employment_types,
      location: jobData.location,
      skillsRequired: jobData.skills_required,
      categoryIds: jobData.category_ids,
      enabledStages: jobData.enabled_stages as import('src/domain/enums/ats-stage.enum').ATSStage[],
      isFeatured,
      totalVacancies: jobData.total_vacancies ?? 1,
    });

    const createdJob = await this._jobPostingRepository.postJob(jobPosting);

    await this._companySubscriptionRepository.incrementJobPostsUsed(subscription.id);
    if (isFeatured) {
      await this._companySubscriptionRepository.incrementFeaturedJobsUsed(subscription.id);
    }

    return JobPostingMapper.toResponse(createdJob);
  }
}





