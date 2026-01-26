import { DeleteCompanyTechStackRequestDto } from 'src/application/dtos/company/profile/stack/requests/company-tech-stack.dto';

export interface IDeleteCompanyTechStackUseCase {
  execute(dto: DeleteCompanyTechStackRequestDto): Promise<void>;
}
