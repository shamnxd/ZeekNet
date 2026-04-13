import { injectable, inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { IHandleStripeWebhookUseCase } from 'src/domain/interfaces/use-cases/payment/stripe/IHandleStripeWebhookUseCase';
import { logger } from 'src/infrastructure/config/logger';
import { sendSuccessResponse, sendBadRequestResponse } from 'src/shared/utils';
import { SUCCESS, VALIDATION, ERROR } from 'src/shared/constants/messages';
import { TYPES } from 'src/shared/constants/types';

@injectable()
export class StripeWebhookController {
  constructor(@inject(TYPES.HandleStripeWebhookUseCase) private readonly _handleStripeWebhookUseCase: IHandleStripeWebhookUseCase) { }

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


