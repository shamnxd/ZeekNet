import { CompanyContact } from 'src/domain/entities/company-contact.entity';
import { UpdateCompanyContactDto } from 'src/application/dtos/company/profile/contacts/requests/company-contact.dto';

export interface IUpsertCompanyContactUseCase {
  execute(data: UpdateCompanyContactDto): Promise<CompanyContact>;
}


