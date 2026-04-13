import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ICompanyContactRepository } from 'src/domain/interfaces/repositories/company/ICompanyContactRepository';
import { CompanyContact } from 'src/domain/entities/company-contact.entity';
import { UpsertCompanyContactRequestDto } from 'src/application/dtos/company/profile/contacts/requests/company-contact.dto';
import { IUpsertCompanyContactUseCase } from 'src/domain/interfaces/use-cases/company/profile/contacts/IUpsertCompanyContactUseCase';
import { IGetCompanyIdByUserIdUseCase } from 'src/domain/interfaces/use-cases/admin/companies/IGetCompanyIdByUserIdUseCase';
import { CompanyContactResponseDto } from 'src/application/dtos/company/profile/info/responses/company-response.dto';
import { CompanyContactMapper } from 'src/application/mappers/company/profile/company-contact.mapper';
import { ERROR } from 'src/shared/constants/messages';


@injectable()
export class UpsertCompanyContactUseCase implements IUpsertCompanyContactUseCase {
  constructor(
    @inject(TYPES.CompanyContactRepository) private readonly _companyContactRepository: ICompanyContactRepository,
    @inject(TYPES.GetCompanyIdByUserIdUseCase) private readonly _getCompanyIdByUserIdUseCase: IGetCompanyIdByUserIdUseCase,
  ) {}

  async execute(dto: UpsertCompanyContactRequestDto): Promise<CompanyContactResponseDto> {
    const companyId = await this._getCompanyIdByUserIdUseCase.execute(dto.userId);
    const { userId, ...contactData } = dto;
    const existingContact = await this._companyContactRepository.findOne({ companyId });
    if (existingContact) {
      const updated = await this._companyContactRepository.update(existingContact.id, contactData);
      if (!updated) throw new Error(ERROR.NOT_FOUND('Contact'));
      return CompanyContactMapper.toResponse(updated);
    }
    const contact = CompanyContact.create({ companyId, ...contactData });
    const created = await this._companyContactRepository.create(contact);
    return CompanyContactMapper.toResponse(created);
  }
}
