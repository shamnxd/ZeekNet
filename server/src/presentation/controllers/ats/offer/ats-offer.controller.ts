import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import { IUploadOfferUseCase } from 'src/domain/interfaces/use-cases/application/offer/IUploadOfferUseCase';
import { IUpdateOfferStatusUseCase } from 'src/domain/interfaces/use-cases/application/offer/IUpdateOfferStatusUseCase';
import { IGetOffersByApplicationUseCase } from 'src/domain/interfaces/use-cases/application/offer/IGetOffersByApplicationUseCase';
import { UploadOfferSchema } from 'src/application/dtos/application/offer/requests/upload-offer.dto';
import { UpdateOfferStatusDtoSchema } from 'src/application/dtos/application/offer/requests/update-offer-status.dto';
import { formatZodErrors, handleAsyncError, handleValidationError, sendCreatedResponse, sendSuccessResponse, validateUserId } from 'src/shared/utils';
import { SUCCESS } from 'src/shared/constants/messages';

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
        file: req.file ? {
          buffer: req.file.buffer,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
        } : undefined,
      });

      sendCreatedResponse(res, SUCCESS.CREATED('Offer'), offer);
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

      sendSuccessResponse(res, SUCCESS.UPDATED('Offer status'), offer);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getOffersByApplication = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { applicationId } = req.params;

      const offers = await this._getOffersByApplicationUseCase.execute(applicationId);

      sendSuccessResponse(res, SUCCESS.RETRIEVED('Offers'), offers);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}




