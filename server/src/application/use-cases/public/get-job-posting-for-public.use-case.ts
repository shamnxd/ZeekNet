import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IGetJobPostingForPublicUseCase } from 'src/domain/interfaces/use-cases/public/IGetJobPostingForPublicUseCase';
import { AppError } from '../../../domain/errors/errors';
import { JobPostingDetailResponseDto } from '../../dto/job-posting/job-posting-response.dto';
import { IS3Service } from '../../../domain/interfaces/services/IS3Service';
import { Types } from 'mongoose';

export class GetJobPostingForPublicUseCase implements IGetJobPostingForPublicUseCase {
  constructor(
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _s3Service: IS3Service,
  ) {}

  async execute(jobId: string, userId?: string): Promise<JobPostingDetailResponseDto> {
    if (!jobId || jobId === 'undefined') {
      throw new AppError('Job ID is required', 400);
    }

    const jobPosting = await this._jobPostingRepository.findById(jobId);

    if (!jobPosting) {
      throw new AppError('Job posting not found', 404);
    }

    if (jobPosting.status === 'blocked') {
      throw new AppError('Job posting not found', 404);
    }

    if (jobPosting.status !== 'active') {
      throw new AppError('Job posting not found', 404);
    }

    await this._jobPostingRepository.update(jobId, { 
      viewCount: jobPosting.viewCount + 1, 
    });

    const company = await this.getCompanyDetails(jobPosting.companyId);

    let hasApplied: boolean | undefined = undefined;
    if (userId) {
      const existingApplication = await this._jobApplicationRepository.findOne({
        seeker_id: userId,
        job_id: jobId,
      });
      hasApplied = !!existingApplication;
    }

    return {
      id: jobPosting.id,
      title: jobPosting.title,
      description: jobPosting.description,
      responsibilities: jobPosting.responsibilities,
      qualifications: jobPosting.qualifications,
      nice_to_haves: jobPosting.niceToHaves,
      benefits: jobPosting.benefits,
      salary: jobPosting.salary,
      employment_types: jobPosting.employmentTypes,
      location: jobPosting.location,
      skills_required: jobPosting.skillsRequired,
      category_ids: jobPosting.categoryIds,
      status: jobPosting.status,
      is_featured: jobPosting.isFeatured,
      unpublish_reason: jobPosting.unpublishReason,
      view_count: jobPosting.viewCount,
      application_count: jobPosting.applicationCount,
      createdAt: jobPosting.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: jobPosting.updatedAt?.toISOString() || new Date().toISOString(),
      has_applied: hasApplied,
      company,
    };
  }

  private async getCompanyDetails(companyId: string): Promise<JobPostingDetailResponseDto['company']> {
    if (!companyId || !Types.ObjectId.isValid(companyId)) {
      return {
        companyName: 'ZeekNet Company',
        logo: '/white.png',
        organisation: 'Unknown',
        employeeCount: 0,
        websiteLink: '',
        workplacePictures: [],
      };
    }
    const { CompanyProfileModel } = await import('../../../infrastructure/database/mongodb/models/company-profile.model');
    const { UserModel } = await import('../../../infrastructure/database/mongodb/models/user.model');
    const { CompanyWorkplacePicturesModel } = await import('../../../infrastructure/database/mongodb/models/company-workplace-pictures.model');

    const companyProfile = await CompanyProfileModel.findById(companyId).populate('userId', 'isBlocked');

    if (!companyProfile) {
      return {
        companyName: 'ZeekNet Company',
        logo: '/white.png',
        organisation: 'Unknown',
        employeeCount: 0,
        websiteLink: '',
        workplacePictures: [],
      };
    }

    const user = await UserModel.findById(companyProfile.userId);
    if (user && user.isBlocked) {
      throw new AppError('Job posting not found', 404);
    }

    const workplacePictures = await CompanyWorkplacePicturesModel.find({
      companyId: companyProfile._id,
    })
      .select('pictureUrl caption')
      .limit(4);

    const logoKey = companyProfile.logo && !companyProfile.logo.startsWith('http') && companyProfile.logo !== '/white.png' 
      ? companyProfile.logo 
      : null;
    const logoUrl = logoKey ? await this._s3Service.getSignedUrl(logoKey) : (companyProfile.logo || '/white.png');

    const workplacePictureUrls = await Promise.all(
      workplacePictures.map(pic => {
        const picKey = pic.pictureUrl && !pic.pictureUrl.startsWith('http') ? pic.pictureUrl : null;
        return picKey ? this._s3Service.getSignedUrl(picKey) : Promise.resolve(pic.pictureUrl);
      }),
    );

    return {
      companyName: companyProfile.companyName || 'Unknown Company',
      logo: logoUrl,
      organisation: companyProfile.organisation || 'Unknown',
      employeeCount: companyProfile.employeeCount || 0,
      websiteLink: companyProfile.websiteLink || '',
      workplacePictures: workplacePictures.map((pic, index) => ({
        pictureUrl: workplacePictureUrls[index] || pic.pictureUrl,
        caption: pic.caption,
      })),
    };
  }
}
