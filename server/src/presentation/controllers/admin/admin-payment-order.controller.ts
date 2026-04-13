import { NextFunction, Request, Response } from 'express';
import { IGetAllPaymentOrdersUseCase } from 'src/domain/interfaces/use-cases/admin/payments/IGetAllPaymentOrdersUseCase';
import { GetAllPaymentOrdersDto } from 'src/application/dtos/admin/payments/requests/payment-order.dto';
import { formatZodErrors, handleAsyncError, handleValidationError, sendSuccessResponse } from 'src/shared/utils';
import { SUCCESS } from 'src/shared/constants/messages';
import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';

@injectable()
export class AdminPaymentOrderController {
  constructor(
    @inject(TYPES.GetAllPaymentOrdersUseCase) private readonly _getAllPaymentOrdersUseCase: IGetAllPaymentOrdersUseCase,
  ) { }

  getAllPaymentOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = GetAllPaymentOrdersDto.safeParse(req.query);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const result = await this._getAllPaymentOrdersUseCase.execute(parsed.data);
      sendSuccessResponse(res, SUCCESS.RETRIEVED('Payment orders'), result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}

