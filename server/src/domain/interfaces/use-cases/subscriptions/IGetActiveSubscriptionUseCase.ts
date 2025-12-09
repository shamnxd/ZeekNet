import { CompanySubscription } from 'src/domain/entities/company-subscription.entity';

// be - res

export interface IGetActiveSubscriptionUseCase {
  execute(userId: string): Promise<(CompanySubscription & { activeJobCount?: number; }) | null>;
}
