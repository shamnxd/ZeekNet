import { IGetCompanyProfileUseCase } from 'src/domain/interfaces/use-cases/company/profile/info/IGetCompanyProfileUseCase';
import { JobStatus } from 'src/domain/enums/job-status.enum';
import { EmploymentType } from 'src/domain/enums/employment-type.enum';
import { IGetCompanyJobPostingsUseCase } from 'src/domain/interfaces/use-cases/job/IGetCompanyJobPostingsUseCase';
import { IGetCompanyProfileWithJobPostingsUseCase } from 'src/domain/interfaces/use-cases/admin/companies/IGetCompanyProfileWithJobPostingsUseCase';
import { JobPosting } from 'src/domain/entities/job-posting.entity';
import { CompanyProfileWithDetailsResponseDto } from 'src/application/dtos/company/profile/info/responses/company-response.dto';
import { CompanyProfileMapper } from 'src/application/mappers/company/profile/company-profile.mapper';
import { NotFoundError } from 'src/domain/errors/errors';
import { IS3Service } from 'src/domain/interfaces/services/IS3Service';

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
    const businessLicenseKey = companyProfile.profile.business_license && !companyProfile.profile.business_license.startsWith('http') 
      ? companyProfile.profile.business_license 
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

    const responseData: CompanyProfileWithDetailsResponseDto = {
      ...companyProfile,
      profile: {
        ...companyProfile.profile,
        logo: logoUrl || companyProfile.profile.logo,
        banner: bannerUrl || companyProfile.profile.banner,
        business_license: businessLicenseUrl || companyProfile.profile.business_license,
      },
      workplacePictures: companyProfile.workplacePictures.map((pic, index) => ({
        ...pic,
        pictureUrl: workplacePictureUrls[index] || pic.pictureUrl,
      })),
      jobPostings: jobDtos,
    };

    return responseData;
  }
}



