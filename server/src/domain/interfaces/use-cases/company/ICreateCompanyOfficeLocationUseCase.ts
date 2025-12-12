import { CreateCompanyOfficeLocationRequestDto } from 'src/application/dto/company/company-office-location.dto';
import { CompanyOfficeLocation } from 'src/domain/entities/company-office-location.entity';


export interface ICreateCompanyOfficeLocationUseCase {
  execute(data: CreateCompanyOfficeLocationRequestDto): Promise<CompanyOfficeLocation>;
}
