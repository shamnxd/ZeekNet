import { NextFunction, Request, Response } from 'express';
import { IGetAllPaymentOrdersUseCase } from 'src/domain/interfaces/use-cases/admin/payments/IGetAllPaymentOrdersUseCase';
import { GetAllPaymentOrdersDto } from 'src/application/dtos/admin/payments/requests/payment-order.dto';
import { formatZodErrors } from 'src/shared/utils/presentation/zod-error-formatter.util';
import { handleAsyncError, handleValidationError, sendSuccessResponse } from 'src/shared/utils/presentation/controller.utils';

export class AdminPaymentOrderController {
  constructor(
    private readonly _getAllPaymentOrdersUseCase: IGetAllPaymentOrdersUseCase,
  ) { }

  getAllPaymentOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = GetAllPaymentOrdersDto.safeParse(req.query);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const result = await this._getAllPaymentOrdersUseCase.execute(parsed.data);
      sendSuccessResponse(res, 'Payment orders retrieved successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
