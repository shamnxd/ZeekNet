import { Request, Response, NextFunction } from 'express';
import { GetAllPaymentOrdersUseCase } from '../../../application/use-cases/admin/get-all-payment-orders.use-case';
import { handleAsyncError, sendSuccessResponse } from '../../../shared/utils/controller.utils';

export class AdminPaymentOrderController {
  constructor(
    private readonly _getAllPaymentOrdersUseCase: GetAllPaymentOrdersUseCase,
  ) {}

  getAllPaymentOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
        status: req.query.status as 'pending' | 'completed' | 'failed' | 'cancelled' | undefined,
        search: req.query.search as string | undefined,
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
      };

      const result = await this._getAllPaymentOrdersUseCase.execute(query);
      sendSuccessResponse(res, 'Payment orders retrieved successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
