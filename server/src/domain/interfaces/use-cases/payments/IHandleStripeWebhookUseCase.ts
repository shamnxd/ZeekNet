import { HandleStripeWebhookRequestDto } from 'src/application/dtos/company/common/handle-stripe-webhook.dto';

export interface IHandleStripeWebhookUseCase {
  execute(data: HandleStripeWebhookRequestDto): Promise<{ received: boolean; }>;
}

