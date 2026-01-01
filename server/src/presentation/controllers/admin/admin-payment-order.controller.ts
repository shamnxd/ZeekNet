import { Request, Response, NextFunction } from 'express';
import { GetAllPaymentOrdersUseCase } from '../../../application/use-cases/admin/get-all-payment-orders.use-case';
import { GetAllPaymentOrdersDto } from '../../../application/dtos/admin/common/payment-order.dto';
import { handleAsyncError, handleValidationError, sendSuccessResponse } from '../../../shared/utils/presentation/controller.utils';

export class AdminPaymentOrderController {
  constructor(
    private readonly _getAllPaymentOrdersUseCase: GetAllPaymentOrdersUseCase,
  ) {}

  getAllPaymentOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = GetAllPaymentOrdersDto.safeParse(req.query);
    if (!parsed.success) {
      return handleValidationError(`Invalid query parameters: ${parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`, next);
    }

    try {
      const result = await this._getAllPaymentOrdersUseCase.execute(parsed.data);
      sendSuccessResponse(res, 'Payment orders retrieved successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}


