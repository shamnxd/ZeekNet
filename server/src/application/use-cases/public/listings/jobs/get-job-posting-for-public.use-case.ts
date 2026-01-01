import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { ICompanyWorkplacePicturesRepository } from 'src/domain/interfaces/repositories/company/ICompanyWorkplacePicturesRepository';
import { IGetJobPostingForPublicUseCase } from 'src/domain/interfaces/use-cases/public/listings/jobs/IGetJobPostingForPublicUseCase';
import { BadRequestError, NotFoundError } from 'src/domain/errors/errors';
import { JobPostingDetailResponseDto } from 'src/application/dtos/admin/job/responses/job-posting-response.dto';
import { JobPostingMapper } from 'src/application/mappers/job/job-posting.mapper';
import { CompanyProfileMapper } from 'src/application/mappers/company/profile/company-profile.mapper';
import { CompanyProfile } from 'src/domain/entities/company-profile.entity';
import { IS3Service } from 'src/domain/interfaces/services/IS3Service';

export class GetJobPostingForPublicUseCase implements IGetJobPostingForPublicUseCase {
  constructor(
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _companyWorkplacePicturesRepository: ICompanyWorkplacePicturesRepository,
    private readonly _s3Service: IS3Service,
  ) {}

  async execute(jobId: string, userId?: string): Promise<JobPostingDetailResponseDto> {
    if (!jobId || jobId === 'undefined') {
      throw new BadRequestError('Job ID is required');
    }

    const jobPosting = await this._jobPostingRepository.findById(jobId);

    if (!jobPosting) {
      throw new NotFoundError('Job posting not found');
    }

    if (jobPosting.status === 'blocked') {
      throw new NotFoundError('Job posting not found');
    }

    if (jobPosting.status !== 'active') {
      throw new NotFoundError('Job posting not found');
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

    const response = JobPostingMapper.toDetailedResponse(jobPosting, company);
    response.has_applied = hasApplied;
    return response;
  }

  private async getCompanyDetails(companyId: string): Promise<JobPostingDetailResponseDto['company']> {
    if (!companyId || companyId.length !== 24) {
      return {
        companyName: 'ZeekNet Company',
        logo: '/white.png',
        organisation: 'Unknown',
        employeeCount: 0,
        websiteLink: '',
        workplacePictures: [],
      };
    }
    
    
    const companyProfile = await this._companyProfileRepository.findById(companyId);

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

    
    const user = await this._userRepository.findById(companyProfile.userId);
    if (user && user.isBlocked) {
      throw new NotFoundError('Job posting not found'); 
    }

    
    
    
    const allWorkplacePictures = await this._companyWorkplacePicturesRepository.findMany({
      companyId: companyProfile.id,
    });
    
    const workplacePictures = allWorkplacePictures.slice(0, 4);

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

    return CompanyProfileMapper.toPublicCompanyDetails(
      companyProfile,
      logoUrl,
      workplacePictures.map((pic, index) => ({
        pictureUrl: workplacePictureUrls[index] || pic.pictureUrl,
        caption: pic.caption,
      })),
    );
  }
}


