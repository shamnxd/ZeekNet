import { CompanySubscription } from 'src/domain/entities/company-subscription.entity';


export interface IRevertToDefaultPlanUseCase {
  execute(companyId: string): Promise<CompanySubscription>;
}
