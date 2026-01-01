import { ActiveSubscriptionResponseDto } from 'src/application/dtos/subscriptions/common/active-subscription-response.dto';

export interface IGetActiveSubscriptionUseCase {
  execute(userId: string): Promise<ActiveSubscriptionResponseDto | null>;
}

