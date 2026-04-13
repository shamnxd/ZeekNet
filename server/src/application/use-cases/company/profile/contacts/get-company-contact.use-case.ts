import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ICompanyContactRepository } from 'src/domain/interfaces/repositories/company/ICompanyContactRepository';
import { IGetCompanyContactUseCase } from 'src/domain/interfaces/use-cases/company/profile/contacts/IGetCompanyContactUseCase';
import { GetCompanyContactRequestDto } from 'src/application/dtos/company/profile/contacts/requests/company-contact.dto';
import { IGetCompanyIdByUserIdUseCase } from 'src/domain/interfaces/use-cases/admin/companies/IGetCompanyIdByUserIdUseCase';
import { CompanyContactResponseDto } from 'src/application/dtos/company/profile/info/responses/company-response.dto';
import { CompanyContactMapper } from 'src/application/mappers/company/profile/company-contact.mapper';

@injectable()
export class GetCompanyContactUseCase implements IGetCompanyContactUseCase {
  constructor(
    @inject(TYPES.CompanyContactRepository) private readonly _companyContactRepository: ICompanyContactRepository,
    @inject(TYPES.GetCompanyIdByUserIdUseCase) private readonly _getCompanyIdByUserIdUseCase: IGetCompanyIdByUserIdUseCase,
  ) {}

  async execute(dto: GetCompanyContactRequestDto): Promise<CompanyContactResponseDto[]> {
    const companyId = await this._getCompanyIdByUserIdUseCase.execute(dto.userId);
    const contact = await this._companyContactRepository.findOne({ companyId });
    return contact ? [CompanyContactMapper.toResponse(contact)] : [];
  }
}
