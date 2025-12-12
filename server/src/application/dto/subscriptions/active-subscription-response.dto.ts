import { CompanySubscription } from 'src/domain/entities/company-subscription.entity';

export interface ActiveSubscriptionResponseDto extends CompanySubscription {
  activeJobCount?: number;
}

