import { Response, NextFunction } from 'express';

import { IUploadOfferUseCase } from 'src/domain/interfaces/use-cases/application/offer/IUploadOfferUseCase';
import { IUpdateOfferStatusUseCase } from 'src/domain/interfaces/use-cases/application/offer/IUpdateOfferStatusUseCase';
import { IGetOffersByApplicationUseCase } from 'src/domain/interfaces/use-cases/application/offer/IGetOffersByApplicationUseCase';

import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import { sendSuccessResponse, sendCreatedResponse, validateUserId, handleValidationError, handleAsyncError } from 'src/shared/utils/presentation/controller.utils';
import { formatZodErrors } from 'src/shared/utils/presentation/zod-error-formatter.util';
import { UploadOfferSchema } from 'src/application/dtos/application/offer/requests/upload-offer.dto';
import { UpdateOfferStatusDtoSchema } from 'src/application/dtos/application/offer/requests/update-offer-status.dto';

export class ATSOfferController {
  constructor(
    private readonly _uploadOfferUseCase: IUploadOfferUseCase,
    private readonly _updateOfferStatusUseCase: IUpdateOfferStatusUseCase,
    private readonly _getOffersByApplicationUseCase: IGetOffersByApplicationUseCase,
  ) { }

  uploadOffer = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const validation = UploadOfferSchema.safeParse(req.body);
    if (!validation.success) {
      return handleValidationError(formatZodErrors(validation.error), next);
    }

    try {
      const userId = validateUserId(req);

      const applicationId = req.params.applicationId ||
        (req.body as Record<string, unknown>).applicationId as string;

      const offer = await this._uploadOfferUseCase.execute({
        ...validation.data,
        applicationId,
        performedBy: userId,
      });

      sendCreatedResponse(res, 'Offer uploaded successfully', offer);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateOfferStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const validation = UpdateOfferStatusDtoSchema.safeParse(req.body);
    if (!validation.success) {
      return handleValidationError(formatZodErrors(validation.error), next);
    }

    try {
      const { id } = req.params;
      const userId = validateUserId(req);

      const offer = await this._updateOfferStatusUseCase.execute({
        offerId: id,
        ...validation.data,
        performedBy: userId,
        performedByName: 'Unknown',
      });

      sendSuccessResponse(res, 'Offer status updated successfully', offer);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getOffersByApplication = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { applicationId } = req.params;

      const offers = await this._getOffersByApplicationUseCase.execute(applicationId);

      sendSuccessResponse(res, 'Offers retrieved successfully', offers);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}



