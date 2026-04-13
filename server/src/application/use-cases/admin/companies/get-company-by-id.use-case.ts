import { IGetCompanyByIdUseCase } from 'src/domain/interfaces/use-cases/admin/companies/IGetCompanyByIdUseCase';
import { CompanyProfile } from 'src/domain/entities/company-profile.entity';
import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { ICompanyVerificationRepository } from 'src/domain/interfaces/repositories/company/ICompanyVerificationRepository';
import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { ICompanyContactRepository } from 'src/domain/interfaces/repositories/company/ICompanyContactRepository';
import { ICompanyOfficeLocationRepository } from 'src/domain/interfaces/repositories/company/ICompanyOfficeLocationRepository';
import { ICompanyTechStackRepository } from 'src/domain/interfaces/repositories/company/ICompanyTechStackRepository';
import { ICompanyBenefitsRepository } from 'src/domain/interfaces/repositories/company/ICompanyBenefitsRepository';
import { ICompanyWorkplacePicturesRepository } from 'src/domain/interfaces/repositories/company/ICompanyWorkplacePicturesRepository';
import { CompanyWithVerificationResult } from 'src/application/dtos/admin/companies/responses/company-with-verification-result.dto';
import { CompanyProfileMapper } from 'src/application/mappers/company/profile/company-profile.mapper';
import { IS3Service } from 'src/domain/interfaces/services/IS3Service';
import { NotFoundError } from 'src/domain/errors/errors';
import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ERROR } from 'src/shared/constants/messages';


@injectable()
export class GetCompanyByIdUseCase implements IGetCompanyByIdUseCase {
  constructor(
    @inject(TYPES.CompanyProfileRepository) private readonly _companyProfileRepository: ICompanyProfileRepository,
    @inject(TYPES.CompanyVerificationRepository) private readonly _companyVerificationRepository: ICompanyVerificationRepository,
    @inject(TYPES.JobPostingRepository) private readonly _jobPostingRepository: IJobPostingRepository,
    @inject(TYPES.CompanyContactRepository) private readonly _companyContactRepository: ICompanyContactRepository,
    @inject(TYPES.CompanyOfficeLocationRepository) private readonly _officeLocationRepository: ICompanyOfficeLocationRepository,
    @inject(TYPES.CompanyTechStackRepository) private readonly _techStackRepository: ICompanyTechStackRepository,
    @inject(TYPES.CompanyBenefitsRepository) private readonly _benefitsRepository: ICompanyBenefitsRepository,
    @inject(TYPES.CompanyWorkplacePicturesRepository) private readonly _workplacePicturesRepository: ICompanyWorkplacePicturesRepository,
    @inject(TYPES.S3Service) private readonly _s3Service: IS3Service,
  ) { }

  async execute(companyId: string): Promise<CompanyWithVerificationResult> {
    const company = await this._companyProfileRepository.findById(companyId);

    if (!company) {
      throw new NotFoundError(ERROR.NOT_FOUND('Company'));
    }

    const [
      verification,
      contact,
      locations,
      techStack,
      benefits,
      workplacePictures,
      activeJobCount,
      jobs,
    ] = await Promise.all([
      this._companyVerificationRepository.findOne({ companyId }),
      this._companyContactRepository.findOne({ companyId }),
      this._officeLocationRepository.findMany({ companyId }),
      this._techStackRepository.findMany({ companyId }),
      this._benefitsRepository.findMany({ companyId }),
      this._workplacePicturesRepository.findMany({ companyId }),
      this._jobPostingRepository.countActiveJobsByCompany(companyId),
      this._jobPostingRepository.findMany({ company_id: companyId, status: 'active' }), // Use company_id as per schema
    ]);

    const [logoUrl, bannerUrl, businessLicenseUrl] = await Promise.all([
      company.logo && !company.logo.startsWith('http') ? this._s3Service.getSignedUrl(company.logo) : Promise.resolve(company.logo),
      company.banner && !company.banner.startsWith('http') ? this._s3Service.getSignedUrl(company.banner) : Promise.resolve(company.banner),
      verification?.businessLicenseUrl && !verification.businessLicenseUrl.startsWith('http')
        ? this._s3Service.getSignedUrl(verification.businessLicenseUrl)
        : Promise.resolve(verification?.businessLicenseUrl),
    ]);

    const workplacePicturesWithUrls = await Promise.all(
      workplacePictures.map(async (pic) => {
        let imageUrl = pic.pictureUrl;
        if (imageUrl && !imageUrl.startsWith('http')) {
          imageUrl = await this._s3Service.getSignedUrl(imageUrl);
        }
        return {
          id: pic.id,
          imageUrl,
          caption: pic.caption,
        };
      }),
    );

    const companyWithSignedUrls = CompanyProfile.create({
      ...company,
      logo: logoUrl || company.logo,
      banner: bannerUrl || company.banner,
    });

    return CompanyProfileMapper.toAdminFullProfileResponse({
      company: companyWithSignedUrls,
      verification: verification ? {
        taxId: verification.taxId,
        businessLicenseUrl: businessLicenseUrl || verification.businessLicenseUrl,
      } : null,
      contact,
      locations,
      techStack,
      benefits,
      workplacePictures: workplacePicturesWithUrls,
      activeJobCount,
    });
  }
}


