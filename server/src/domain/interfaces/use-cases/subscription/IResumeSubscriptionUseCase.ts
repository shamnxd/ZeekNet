import { CompanySubscription } from 'src/domain/entities/company-subscription.entity';


export interface IResumeSubscriptionUseCase {
  execute(userId: string): Promise<CompanySubscription>;
}
