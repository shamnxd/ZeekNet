import { HandleStripeWebhookRequestDto } from 'src/application/dto/company/handle-stripe-webhook.dto';

export interface IHandleStripeWebhookUseCase {
  execute(data: HandleStripeWebhookRequestDto): Promise<{ received: boolean; }>;
}
