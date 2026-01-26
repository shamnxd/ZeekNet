import { CompanyContactResponseDto } from 'src/application/dtos/company/profile/info/responses/company-response.dto';
import { UpsertCompanyContactRequestDto } from 'src/application/dtos/company/profile/contacts/requests/company-contact.dto';

export interface IUpsertCompanyContactUseCase {
  execute(dto: UpsertCompanyContactRequestDto): Promise<CompanyContactResponseDto>;
}


