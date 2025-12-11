import { ActiveSubscriptionResponseDto } from 'src/application/dto/subscriptions/active-subscription-response.dto';

export interface IGetActiveSubscriptionUseCase {
  execute(userId: string): Promise<ActiveSubscriptionResponseDto | null>;
}
