import { CompanyContact } from 'src/domain/entities/company-contact.entity';
import { UpdateCompanyContactDto } from 'src/application/dto/company/company-contact.dto';

export interface IUpsertCompanyContactUseCase {
  execute(data: UpdateCompanyContactDto): Promise<CompanyContact>;
}

