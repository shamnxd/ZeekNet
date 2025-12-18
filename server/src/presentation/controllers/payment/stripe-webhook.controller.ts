import { Request, Response, NextFunction } from 'express';
import { HandleStripeWebhookUseCase } from '../../../application/use-cases/company/handle-stripe-webhook.use-case';
import { logger } from '../../../infrastructure/config/logger';
import { sendSuccessResponse, sendBadRequestResponse } from '../../../shared/utils/controller.utils';
import { HttpStatus } from '../../../domain/enums/http-status.enum';

export class StripeWebhookController {
  constructor(
    private readonly _handleStripeWebhookUseCase: HandleStripeWebhookUseCase,
  ) {}

  handleWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const signature = req.headers['stripe-signature'] as string;

      if (!signature) {
        sendBadRequestResponse(res, 'Missing stripe-signature header');
        return;
      }

      const result = await this._handleStripeWebhookUseCase.execute({
        payload: req.body,
        signature,
      });

      sendSuccessResponse(res, 'Webhook validated and processed', result);
    } catch (error) {
      logger.error('Stripe webhook error:', error);
      
      if (error instanceof Error && error.message.includes('signature')) {
        sendBadRequestResponse(res, 'Webhook signature verification failed');
        return;
      }

      sendSuccessResponse(res, 'Internal processing error', { received: true });
    }
  };
}
