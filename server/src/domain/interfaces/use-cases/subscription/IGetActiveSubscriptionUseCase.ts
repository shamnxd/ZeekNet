import { ActiveSubscriptionResponseDto } from 'src/application/dtos/admin/subscription/responses/active-subscription-response.dto';

export interface IGetActiveSubscriptionUseCase {
  execute(userId: string): Promise<ActiveSubscriptionResponseDto | null>;
}

