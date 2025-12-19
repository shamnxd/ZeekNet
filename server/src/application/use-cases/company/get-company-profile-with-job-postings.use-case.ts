import { IGetCompanyProfileUseCase } from '../../../domain/interfaces/use-cases/company/IGetCompanyProfileUseCase';
import { JobStatus } from '../../../domain/enums/job-status.enum';
import { EmploymentType } from '../../../domain/enums/employment-type.enum';
import { IGetCompanyJobPostingsUseCase } from '../../../domain/interfaces/use-cases/company/IGetCompanyJobPostingsUseCase';
import { IGetCompanyProfileWithJobPostingsUseCase } from '../../../domain/interfaces/use-cases/company/IGetCompanyProfileWithJobPostingsUseCase';
import { JobPosting } from '../../../domain/entities/job-posting.entity';
import { CompanyProfileWithDetailsResponseDto } from '../../dto/company/company-response.dto';
import { CompanyProfileMapper } from '../../mappers/company-profile.mapper';
import { NotFoundError } from '../../../domain/errors/errors';
import { IS3Service } from '../../../domain/interfaces/services/IS3Service';

export class GetCompanyProfileWithJobPostingsUseCase implements IGetCompanyProfileWithJobPostingsUseCase {
  constructor(
    private readonly _getCompanyProfileUseCase: IGetCompanyProfileUseCase,
    private readonly _getCompanyJobPostingsUseCase: IGetCompanyJobPostingsUseCase,
    private readonly _s3Service: IS3Service,
  ) {}

  async execute(userId: string): Promise<CompanyProfileWithDetailsResponseDto> {
    const companyProfile = await this._getCompanyProfileUseCase.execute(userId);

    if (!companyProfile) {
      throw new NotFoundError('Company profile not found');
    }

    const jobPostingsQuery = {
      page: 1,
      limit: 3,
      is_active: true,
      category_ids: undefined,
      employment_types: undefined,
      salary_min: undefined,
      salary_max: undefined,
      location: undefined,
      search: undefined,
    };

    const jobPostings = await this._getCompanyJobPostingsUseCase.execute({ userId, ...jobPostingsQuery });

    const jobDtos = jobPostings.jobs.map((j) => ({
      id: j.id,
      title: j.title,
      description: '',
      location: '',
      employmentType: j.employmentTypes?.[0] || '',
      status: j.status,
      createdAt: j.createdAt.toISOString(),
      updatedAt: j.createdAt.toISOString(),
    }));

    const logoKey = companyProfile.profile.logo && !companyProfile.profile.logo.startsWith('http') ? companyProfile.profile.logo : null;
    const bannerKey = companyProfile.profile.banner && !companyProfile.profile.banner.startsWith('http') ? companyProfile.profile.banner : null;
    const businessLicenseKey = companyProfile.verification?.businessLicenseUrl && !companyProfile.verification.businessLicenseUrl.startsWith('http') 
      ? companyProfile.verification.businessLicenseUrl 
      : null;

    const [logoUrl, bannerUrl, businessLicenseUrl, workplacePictureUrls] = await Promise.all([
      logoKey ? this._s3Service.getSignedUrl(logoKey) : Promise.resolve(null),
      bannerKey ? this._s3Service.getSignedUrl(bannerKey) : Promise.resolve(null),
      businessLicenseKey ? this._s3Service.getSignedUrl(businessLicenseKey) : Promise.resolve(null),
      Promise.all(companyProfile.workplacePictures.map(pic => {
        const picKey = pic.pictureUrl && !pic.pictureUrl.startsWith('http') ? pic.pictureUrl : null;
        return picKey ? this._s3Service.getSignedUrl(picKey) : Promise.resolve(pic.pictureUrl);
      })),
    ]);

    const responseData = CompanyProfileMapper.toDetailedResponse({
      ...companyProfile,
      jobPostings: jobDtos,
      signedUrls: {
        logo: logoUrl,
        banner: bannerUrl,
        businessLicense: businessLicenseUrl,
        workplacePictures: companyProfile.workplacePictures.map((pic, index) => ({
          id: pic.id,
          pictureUrl: workplacePictureUrls[index] || pic.pictureUrl,
        })),
      },
    });

    return responseData;
  }
}

