import { Request, Response, NextFunction } from 'express';
import { HandleStripeWebhookUseCase } from 'src/application/use-cases/payment/stripe/handle-stripe-webhook.use-case';
import { logger } from 'src/infrastructure/config/logger';
import { sendSuccessResponse, sendBadRequestResponse } from 'src/shared/utils';
import { SUCCESS, VALIDATION, ERROR } from 'src/shared/constants/messages';

export class StripeWebhookController {
  constructor(private readonly _handleStripeWebhookUseCase: HandleStripeWebhookUseCase) { }

  handleWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const signature = req.headers['stripe-signature'] as string;

      if (!signature) {
        sendBadRequestResponse(res, VALIDATION.REQUIRED('stripe-signature header'));
        return;
      }

      const result = await this._handleStripeWebhookUseCase.execute({
        payload: req.body,
        signature,
      });

      sendSuccessResponse(res, SUCCESS.ACTION('Webhook processing'), result);
    } catch (error) {
      logger.error('Stripe webhook error:', error);

      if (error instanceof Error && error.message.includes('signature')) {
        sendBadRequestResponse(res, ERROR.INVALID_SIGNATURE);
        return;
      }

      sendSuccessResponse(res, ERROR.INTERNAL_SERVER, { received: true });
    }
  };
}


