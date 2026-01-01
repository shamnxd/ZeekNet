import { HandleStripeWebhookRequestDto } from 'src/application/dtos/payment/stripe/requests/handle-stripe-webhook.dto';

export interface IHandleStripeWebhookUseCase {
  execute(data: HandleStripeWebhookRequestDto): Promise<{ received: boolean; }>;
}

