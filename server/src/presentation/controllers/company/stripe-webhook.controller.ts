import { Request, Response, NextFunction } from 'express';
import { HandleStripeWebhookUseCase } from '../../../application/use-cases/company/handle-stripe-webhook.use-case';
import { logger } from '../../../infrastructure/config/logger';

export class StripeWebhookController {
  constructor(
    private readonly _handleStripeWebhookUseCase: HandleStripeWebhookUseCase,
  ) {}

  handleWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const signature = req.headers['stripe-signature'] as string;

      if (!signature) {
        res.status(400).json({ error: 'Missing stripe-signature header' });
        return;
      }

      const result = await this._handleStripeWebhookUseCase.execute(req.body, signature);

      res.status(200).json(result);
    } catch (error) {
      logger.error('Stripe webhook error:', error);
      
      if (error instanceof Error && error.message.includes('signature')) {
        res.status(400).json({ error: 'Webhook signature verification failed' });
        return;
      }

      res.status(200).json({ received: true, error: 'Internal processing error' });
    }
  };
}
