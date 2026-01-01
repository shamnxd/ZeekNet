import { CompanySubscription } from 'src/domain/entities/company-subscription.entity';


export interface ICancelSubscriptionUseCase {
  execute(userId: string): Promise<CompanySubscription>;
}
