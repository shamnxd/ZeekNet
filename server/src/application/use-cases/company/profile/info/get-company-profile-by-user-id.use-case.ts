import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { BadRequestError } from 'src/domain/errors/errors';
import { IGetCompanyProfileByUserIdUseCase } from 'src/domain/interfaces/use-cases/company/profile/info/IGetCompanyProfileByUserIdUseCase';
import { CompanyProfileResponseDto } from 'src/application/dtos/company/profile/info/responses/company-response.dto';
import { CompanyProfileMapper } from 'src/application/mappers/company/profile/company-profile.mapper';

export class GetCompanyProfileByUserIdUseCase implements IGetCompanyProfileByUserIdUseCase {
  constructor(private readonly _companyProfileRepository: ICompanyProfileRepository) {}

  async execute(userId: string): Promise<CompanyProfileResponseDto | null> {
    if (!userId) {
      throw new BadRequestError('User ID is required');
    }

    const companyProfile = await this._companyProfileRepository.findOne({ userId });
    return companyProfile ? CompanyProfileMapper.toResponse(companyProfile) : null;
  }
}
