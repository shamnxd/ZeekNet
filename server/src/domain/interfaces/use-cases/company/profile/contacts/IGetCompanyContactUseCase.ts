import { CompanyContactResponseDto } from 'src/application/dtos/company/profile/info/responses/company-response.dto';
import { GetCompanyContactRequestDto } from 'src/application/dtos/company/profile/contacts/requests/company-contact.dto';

export interface IGetCompanyContactUseCase {
  execute(dto: GetCompanyContactRequestDto): Promise<CompanyContactResponseDto[]>;
}

