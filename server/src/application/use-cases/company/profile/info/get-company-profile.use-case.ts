import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { ICompanyContactRepository } from 'src/domain/interfaces/repositories/company/ICompanyContactRepository';
import { ICompanyTechStackRepository } from 'src/domain/interfaces/repositories/company/ICompanyTechStackRepository';
import { ICompanyOfficeLocationRepository } from 'src/domain/interfaces/repositories/company/ICompanyOfficeLocationRepository';
import { ICompanyBenefitsRepository } from 'src/domain/interfaces/repositories/company/ICompanyBenefitsRepository';
import { ICompanyWorkplacePicturesRepository } from 'src/domain/interfaces/repositories/company/ICompanyWorkplacePicturesRepository';
import { ICompanyVerificationRepository } from 'src/domain/interfaces/repositories/company/ICompanyVerificationRepository';
import { IGetCompanyProfileUseCase } from 'src/domain/interfaces/use-cases/company/profile/info/IGetCompanyProfileUseCase';
import { GetCompanyProfileResponseDto } from 'src/application/dtos/company/profile/info/responses/company-profile-response.dto';
import { CompanyProfileMapper } from 'src/application/mappers/company/profile/company-profile.mapper';

export class GetCompanyProfileUseCase implements IGetCompanyProfileUseCase {
  constructor(
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _companyContactRepository: ICompanyContactRepository,
    private readonly _companyTechStackRepository: ICompanyTechStackRepository,
    private readonly _companyOfficeLocationRepository: ICompanyOfficeLocationRepository,
    private readonly _companyBenefitsRepository: ICompanyBenefitsRepository,
    private readonly _companyWorkplacePicturesRepository: ICompanyWorkplacePicturesRepository,
    private readonly _companyVerificationRepository: ICompanyVerificationRepository,
  ) {}

  async execute(userId: string): Promise<GetCompanyProfileResponseDto | null> {
    const profile = await this._companyProfileRepository.findOne({ userId });
    if (!profile) return null;

    const [contact, locations, techStack, benefits, workplacePictures, verification] = await Promise.all([
      this._companyContactRepository.findOne({ companyId: profile.id }),
      this._companyOfficeLocationRepository.findMany({ companyId: profile.id }),
      this._companyTechStackRepository.findMany({ companyId: profile.id }),
      this._companyBenefitsRepository.findMany({ companyId: profile.id }),
      this._companyWorkplacePicturesRepository.findMany({ companyId: profile.id }),
      this._companyVerificationRepository.findOne({ companyId: profile.id }),
    ]);

    return CompanyProfileMapper.toDetailedResponse({
      profile,
      contact,
      locations,
      techStack,
      benefits,
      workplacePictures,
      verification,
    });
  }
}



